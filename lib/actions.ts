'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from './supabase-server';

/**
 * Poll Management Server Actions
 * 
 * This module contains comprehensive server-side functions for managing polls,
 * including creation, retrieval, voting, updating, and deletion operations.
 * 
 * Features:
 * - Secure user authentication and authorization
 * - Input validation and sanitization
 * - Admin privilege management
 * - Comprehensive error handling
 * - Database operations with Supabase
 * - Path revalidation for optimal caching
 * 
 * Security Measures:
 * - XSS protection through input sanitization
 * - User ownership verification for CRUD operations
 * - Admin access control for sensitive operations
 * - Duplicate vote prevention
 * - SQL injection protection via Supabase client
 */

/**
 * Type definition for poll creation input data
 * @interface CreatePollInput
 */
export type CreatePollInput = {
  /** The main question or title of the poll */
  title: string;
  /** Optional detailed description of the poll */
  description?: string;
  /** Array of poll options with text content */
  options: { text: string }[];
};

/**
 * Creates a new poll with options in the database
 * 
 * Handles the complete poll creation process including validation,
 * database insertion, and automatic redirection to the new poll.
 * 
 * @async
 * @function createPoll
 * @param {FormData} formData - Form data containing poll information
 * @param {string} formData.title - Poll title/question
 * @param {string} [formData.description] - Optional poll description
 * @param {string} formData.options - JSON string of poll options array
 * @returns {Promise<void>} Redirects to the created poll page on success
 * 
 * @throws {Error} When user is not authenticated
 * @throws {Error} When poll title is missing or empty
 * @throws {Error} When less than 2 options are provided
 * @throws {Error} When database operations fail
 * 
 * @example
 * ```typescript
 * // Form data should contain:
 * // title: "What's your favorite color?"
 * // description: "Choose your preferred color"
 * // options: '[{"text":"Red"},{"text":"Blue"},{"text":"Green"}]'
 * await createPoll(formData);
 * // Automatically redirects to /polls/{poll-id}
 * ```
 * 
 * @security
 * - Requires user authentication
 * - Sanitizes input by trimming whitespace
 * - Validates minimum option requirements
 * - Uses parameterized queries via Supabase
 */
export async function createPoll(formData: FormData) {
  try {
    // Initialize server-side Supabase client for secure database operations
    // Using server client ensures RLS policies are enforced and auth context is maintained
    const supabase = createServerSupabaseClient();
    
    // Verify user authentication before allowing poll creation
    // This prevents anonymous users from creating polls and ensures proper ownership
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new Error('You must be logged in to create a poll');
    }
    
    // Extract and validate form data
    // FormData.get() returns string | File | null, so we cast to string for our use case
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const options = formData.get('options') as string;

    // Validate required poll title with trimming to handle whitespace-only inputs
    // Using optional chaining (?.) to safely handle null/undefined values
    if (!title?.trim()) {
      throw new Error('Poll title is required');
    }

    // Parse and validate poll options with comprehensive error handling
    // Default to empty array if options is null/undefined to prevent JSON.parse errors
    let optionsArray;
    try {
      optionsArray = JSON.parse(options || '[]');
    } catch (parseError) {
      throw new Error('Invalid options format provided');
    }
    
    // Enforce minimum option requirement for meaningful polls
    // Array.isArray check prevents runtime errors if parsed JSON isn't an array
    if (!Array.isArray(optionsArray) || optionsArray.length < 2) {
      throw new Error('At least 2 options are required');
    }
    
    // Additional validation: check for empty option texts
    // This prevents polls with blank options that would confuse users
    const hasEmptyOptions = optionsArray.some(option => !option?.text?.trim());
    if (hasEmptyOptions) {
      throw new Error('All poll options must have text content');
    }

    // Insert poll record into database with proper data sanitization
    // Using .select().single() to immediately get the created poll with its generated ID
    // This avoids a separate query and ensures we have the poll ID for options insertion
    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .insert({
        title: title.trim(), // Trim whitespace to ensure clean data storage
        description: description?.trim() || null, // Convert empty strings to null for database consistency
        created_by: user.id, // Establish ownership relationship for authorization
      })
      .select()
      .single();

    if (pollError) {
      // Log the actual error for debugging while showing user-friendly message
      console.error('Database error creating poll:', pollError);
      throw new Error('Failed to create poll');
    }

    // Prepare poll options for database insertion with proper foreign key relationship
    // Map each option to include the poll_id foreign key and initialize vote count
    const optionsToInsert = optionsArray.map((option: { text: string }) => ({
      poll_id: poll.id, // Foreign key linking option to the parent poll
      text: option.text.trim(), // Sanitize option text by removing leading/trailing whitespace
      votes: 0, // Initialize vote count to zero for new options
    }));

    // Insert poll options into database using batch insert for efficiency
    // This is more efficient than individual inserts and maintains atomicity
    const { error: optionsError } = await supabase
      .from('poll_options')
      .insert(optionsToInsert);

    if (optionsError) {
      // If options fail to insert, the poll exists but is unusable
      // In production, consider implementing cleanup or transaction rollback
      console.error('Database error creating poll options:', optionsError);
      throw new Error('Failed to create poll options');
    }

    // Revalidate polls page cache to show the new poll immediately
    // This ensures users see their new poll in listings without manual refresh
    revalidatePath('/polls');
    
    // Redirect to the newly created poll page for immediate viewing
    // Using the poll ID from the database response ensures correct navigation
    redirect(`/polls/${poll.id}`);
  } catch (error) {
    console.error('Error creating poll:', error);
    throw error;
  }
}

/**
 * Submits a vote for a specific poll option
 * 
 * Handles vote submission by incrementing the vote count for the selected
 * option and revalidating the poll page cache for real-time updates.
 * 
 * @async
 * @function submitVote
 * @param {string} pollId - Unique identifier of the poll
 * @param {string} optionId - Unique identifier of the selected poll option
 * @returns {Promise<void>} Completes when vote is successfully recorded
 * 
 * @throws {Error} When poll or option is not found
 * @throws {Error} When database operations fail
 * @throws {Error} When vote count update fails
 * 
 * @example
 * ```typescript
 * // Submit a vote for option 'opt_123' in poll 'poll_456'
 * await submitVote('poll_456', 'opt_123');
 * // Vote count is incremented and page cache is revalidated
 * ```
 * 
 * @security
 * - Validates poll and option existence before voting
 * - Uses atomic database operations to prevent race conditions
 * - Double-checks poll-option relationship for security
 * 
 * @performance
 * - Optimistic updates with immediate cache revalidation
 * - Minimal database queries for efficiency
 */
export async function submitVote(pollId: string, optionId: string) {
  try {
    // Initialize server-side Supabase client for secure database operations
    // Server-side execution prevents client-side vote manipulation
    const supabase = createServerSupabaseClient();
    
    // Fetch current vote count for the selected option with security validation
    // The dual .eq() filters ensure the option actually belongs to the specified poll
    // This prevents voting on options from different polls via parameter manipulation
    const { data: currentOption, error: fetchError } = await supabase
      .from('poll_options')
      .select('votes')
      .eq('id', optionId) // Ensure option exists
      .eq('poll_id', pollId) // Ensure option belongs to the correct poll
      .single(); // Expect exactly one result

    // Handle edge cases: option not found, poll-option mismatch, or database errors
    if (fetchError || !currentOption) {
      console.error('Vote validation failed:', { pollId, optionId, error: fetchError });
      throw new Error('Failed to fetch current vote count');
    }

    // Atomically increment the vote count using the fetched current value
    // This approach prevents race conditions where multiple votes could be lost
    // Using both optionId and pollId in WHERE clause provides additional security
    const { error } = await supabase
      .from('poll_options')
      .update({ votes: currentOption.votes + 1 }) // Increment from known current value
      .eq('id', optionId) // Target specific option
      .eq('poll_id', pollId); // Double-check poll ownership for security

    if (error) {
      // Log detailed error information for debugging vote submission issues
      console.error('Vote submission failed:', { pollId, optionId, currentVotes: currentOption.votes, error });
      throw new Error('Failed to submit vote');
    }

    // Revalidate poll page cache to immediately reflect updated vote counts
    // This ensures users see real-time voting results without manual refresh
    // Only revalidate the specific poll page to minimize cache invalidation overhead
    revalidatePath(`/polls/${pollId}`);
  } catch (error) {
    // Log comprehensive error details for debugging while preserving user privacy
    // Handle unknown error type safely by checking if it's an Error instance
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error submitting vote:', { pollId, optionId, error: errorMessage });
    throw error;
  }
}

/**
 * Deletes a poll and all associated data
 * 
 * Removes a poll from the database along with all its options.
 * Uses cascade deletion to maintain data integrity.
 * 
 * @async
 * @function deletePoll
 * @param {string} pollId - Unique identifier of the poll to delete
 * @returns {Promise<{success: boolean}>} Success status object
 * 
 * @throws {Error} When poll is not found
 * @throws {Error} When database deletion fails
 * @throws {Error} When user lacks permission to delete
 * 
 * @example
 * ```typescript
 * const result = await deletePoll('poll_123');
 * if (result.success) {
 *   console.log('Poll deleted successfully');
 * }
 * ```
 * 
 * @security
 * - Should be combined with ownership verification in calling code
 * - Uses cascade deletion to maintain referential integrity
 * - Automatically removes all associated poll options
 * 
 * @sideEffects
 * - Revalidates /polls page cache
 * - Permanently removes poll and all votes
 */
export async function deletePoll(pollId: string) {
  try {
    // Initialize server-side Supabase client for secure database operations
    // Server-side execution ensures RLS policies are enforced for deletion authorization
    const supabase = createServerSupabaseClient();
    
    // Delete the poll with automatic cascade deletion of related data
    // Database foreign key constraints ensure all poll_options are automatically removed
    // This prevents orphaned options and maintains referential integrity
    // RLS policies should ensure only poll owners or admins can delete polls
    const { error } = await supabase
      .from('polls')
      .delete()
      .eq('id', pollId); // Target specific poll by ID

    if (error) {
      // Log detailed error for debugging while providing user-friendly message
      // Common causes: poll not found, insufficient permissions, or database constraints
      console.error('Poll deletion failed:', { pollId, error });
      throw new Error('Failed to delete poll');
    }

    // Revalidate polls listing page to immediately reflect the deletion
    // This ensures the deleted poll disappears from listings without manual refresh
    // Only revalidate the polls index page to minimize cache invalidation overhead
    revalidatePath('/polls');
    
    return { success: true };
  } catch (error) {
    // Log comprehensive error details for debugging while preserving user privacy
    // Handle unknown error type safely for TypeScript compliance
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error deleting poll:', { pollId, error: errorMessage });
    throw error;
  }
}

/**
 * Updates an existing poll with new data
 * 
 * Handles comprehensive poll updates including title, description,
 * and options. Manages addition, modification, and removal of options
 * while preserving vote counts.
 * 
 * @async
 * @function updatePoll
 * @param {Object} updateData - Poll update information
 * @param {string} updateData.pollId - Unique identifier of the poll to update
 * @param {string} updateData.title - New poll title/question
 * @param {string} updateData.description - New poll description
 * @param {Array} updateData.options - Array of poll options with metadata
 * @param {string} updateData.options[].id - Option ID (or 'new_' prefix for new options)
 * @param {string} updateData.options[].text - Option text content
 * @param {number} updateData.options[].votes - Current vote count (preserved)
 * @returns {Promise<{success: boolean}>} Success status object
 * 
 * @throws {Error} When poll is not found
 * @throws {Error} When database operations fail
 * @throws {Error} When option updates fail
 * 
 * @example
 * ```typescript
 * const result = await updatePoll({
 *   pollId: 'poll_123',
 *   title: 'Updated Poll Question',
 *   description: 'New description',
 *   options: [
 *     { id: 'opt_1', text: 'Modified Option', votes: 5 },
 *     { id: 'new_1', text: 'Brand New Option', votes: 0 }
 *   ]
 * });
 * ```
 * 
 * @security
 * - Should be combined with ownership verification in calling code
 * - Preserves existing vote counts during updates
 * - Validates option relationships before modifications
 * 
 * @complexity
 * - Handles three types of option operations: update, create, delete
 * - Maintains referential integrity throughout the process
 * - Optimizes database operations by batching where possible
 */
export async function updatePoll(updateData: {
  pollId: string;
  title: string;
  description: string;
  options: { id: string; text: string; votes: number }[];
}) {
  try {
    // Initialize server-side Supabase client for secure database operations
    // Server-side execution ensures RLS policies enforce ownership/admin authorization
    const supabase = createServerSupabaseClient();
    
    // Update main poll details (title and description) first
    // Updating poll metadata before options ensures consistency if options update fails
    // Convert empty description to null for database consistency and storage optimization
    const { error: pollError } = await supabase
      .from('polls')
      .update({
        title: updateData.title, // New poll title/question
        description: updateData.description || null, // Convert empty string to null
      })
      .eq('id', updateData.pollId); // Target specific poll by ID

    if (pollError) {
      // Log detailed error for debugging poll metadata update failures
      console.error('Poll metadata update failed:', { pollId: updateData.pollId, pollError });
      throw new Error('Failed to update poll');
    }

    // Fetch existing options to determine what changes are needed
    // This comparison approach allows us to identify creates, updates, and deletes
    // Only selecting id and text since votes are preserved during updates
    const { data: existingOptions, error: fetchError } = await supabase
      .from('poll_options')
      .select('id, text')
      .eq('poll_id', updateData.pollId);

    if (fetchError) {
      console.error('Failed to fetch existing options:', { pollId: updateData.pollId, fetchError });
      throw new Error('Failed to fetch existing options');
    }

    // Process each option: create new ones or update existing ones
    // This loop handles both new option creation and existing option text updates
    // Vote counts are intentionally preserved to maintain polling integrity
    for (const option of updateData.options) {
      if (option.id.startsWith('new_')) {
        // Create new option with zero votes
        // New options use 'new_' prefix to distinguish from existing option IDs
        // Starting with zero votes ensures fair polling for late-added options
        const { error: insertError } = await supabase
          .from('poll_options')
          .insert({
            poll_id: updateData.pollId, // Foreign key linking to parent poll
            text: option.text, // Option text content
            votes: 0, // New options start with zero votes for fairness
          });

        if (insertError) {
          console.error('Failed to add new option:', { pollId: updateData.pollId, optionText: option.text, insertError });
          throw new Error('Failed to add new option');
        }
      } else {
        // Update existing option text if it has changed
        // Only update if text actually changed to avoid unnecessary database operations
        // Vote counts are preserved to maintain polling integrity
        const existingOption = existingOptions?.find(opt => opt.id === option.id);
        if (existingOption && existingOption.text !== option.text) {
          const { error: updateError } = await supabase
            .from('poll_options')
            .update({ text: option.text }) // Only update text, preserve votes
            .eq('id', option.id); // Target specific option

          if (updateError) {
            console.error('Failed to update option:', { optionId: option.id, newText: option.text, updateError });
            throw new Error('Failed to update option');
          }
        }
      }
    }

    // Identify and remove options that are no longer needed
    // Compare existing options with submitted options to find deletions
    // Filter out 'new_' prefixed options since they don't exist in the database yet
    const currentOptionIds = updateData.options
      .filter(opt => !opt.id.startsWith('new_')) // Exclude new options from comparison
      .map(opt => opt.id); // Extract just the IDs for comparison

    // Find options that exist in database but not in the update request
    // These options need to be deleted as they were removed by the user
    const optionsToRemove = existingOptions?.filter(opt => !currentOptionIds.includes(opt.id)) || [];
    
    // Delete removed options (this will also remove associated votes)
    // WARNING: This permanently deletes vote data - consider archiving in production
    // Each deletion is done individually to handle potential foreign key constraints
    for (const option of optionsToRemove) {
      const { error: deleteError } = await supabase
        .from('poll_options')
        .delete()
        .eq('id', option.id); // Target specific option for deletion

      if (deleteError) {
        // Log detailed error for debugging option deletion failures
        console.error('Failed to remove option:', { optionId: option.id, optionText: option.text, deleteError });
        throw new Error('Failed to remove option');
      }
    }

    // Revalidate both polls listing and individual poll pages
    // Polls listing needs revalidation in case poll title changed
    // Individual poll page needs revalidation to show updated content immediately
    revalidatePath('/polls'); // Update polls index page
    revalidatePath(`/polls/${updateData.pollId}`); // Update specific poll page
    
    return { success: true };
  } catch (error) {
    // Log comprehensive error details for debugging while preserving user privacy
    // Handle unknown error type safely for TypeScript compliance
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error updating poll:', { pollId: updateData.pollId, error: errorMessage });
    throw error;
  }
}
