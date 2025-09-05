import { notFound, redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import BackButton from '@/components/shared/back-button';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import DeletePollForm from '@/components/polls/delete-poll-form';

// Force dynamic rendering to ensure fresh data and proper authorization checks
// Critical for delete operations to prevent stale data and ensure real-time ownership verification
export const dynamic = 'force-dynamic';

/**
 * Poll data structure for deletion interface
 * 
 * Minimal poll information needed for the delete confirmation page.
 * Includes ownership data for authorization without exposing sensitive details.
 * 
 * @interface Poll
 */
type Poll = {
  /** Unique identifier for the poll */
  id: string;
  /** Poll title for confirmation display */
  title: string;
  /** Optional poll description for context */
  description: string;
  /** User ID of the poll creator for ownership verification */
  created_by: string;
};

/**
 * Fetches minimal poll information for deletion confirmation
 * 
 * Retrieves only essential poll data needed for the delete confirmation interface.
 * Focuses on ownership verification and user-facing information for safe deletion.
 * 
 * Features:
 * - Minimal data fetching for security (no vote data exposure)
 * - Ownership information for authorization checks
 * - Error handling for missing or inaccessible polls
 * - Optimized query for delete confirmation needs
 * 
 * @async
 * @function getPollDetails
 * @param {string} pollId - Unique identifier of the poll to fetch
 * @returns {Promise<Poll | null>} Basic poll details or null if not found
 * 
 * @throws {Error} When database query fails
 * 
 * @security
 * - Uses server-side Supabase client with RLS policies
 * - Returns minimal data to prevent information leakage
 * - Includes creator information for ownership verification
 * - Handles unauthorized access gracefully
 * 
 * @example
 * ```typescript
 * const poll = await getPollDetails('poll-123');
 * if (poll && poll.created_by === currentUserId) {
 *   // Allow deletion
 * }
 * ```
 */
async function getPollDetails(pollId: string): Promise<Poll | null> {
  try {
    // Use server-side Supabase client for secure data access
    const supabase = createServerSupabaseClient();
    
    // Fetch minimal poll data for delete confirmation
    // Only select fields needed for authorization and user confirmation
    const { data: poll, error } = await supabase
      .from('polls')
      .select('id, title, description, created_by')
      .eq('id', pollId)
      .single();

    // Handle query errors or missing polls
    if (error || !poll) {
      return null;
    }

    // Return minimal poll data for delete confirmation
    return {
      id: poll.id,
      title: poll.title,
      description: poll.description || '', // Handle null descriptions
      created_by: poll.created_by, // Critical for ownership verification
    };
  } catch (error) {
    // Log errors for debugging without exposing sensitive information
    console.error('Error fetching poll details:', error);
    return null;
  }
}

/**
 * Delete Poll Confirmation Page Component
 * 
 * Secure poll deletion interface with ownership verification and clear warnings.
 * Provides a confirmation step before permanent poll deletion to prevent accidental data loss.
 * 
 * Features:
 * - Server-side ownership verification
 * - Clear deletion warnings and consequences
 * - Poll information display for confirmation
 * - Automatic redirection for unauthorized access
 * - Responsive design with destructive action styling
 * 
 * Security:
 * - Validates user authentication before allowing access
 * - Enforces poll ownership through database comparison
 * - Uses server-side rendering for secure data fetching
 * - Redirects unauthorized users to prevent unauthorized deletions
 * 
 * @async
 * @component DeletePollPage
 * @param {Object} props - Component props
 * @param {Promise<{id: string}>} props.params - Next.js dynamic route parameters
 * @returns {Promise<JSX.Element>} Delete confirmation interface or redirects
 * 
 * @throws {notFound} When poll doesn't exist or is inaccessible
 * @throws {redirect} When user is not authenticated or not the poll owner
 * 
 * @example
 * Route: /polls/[id]/delete
 * URL: /polls/abc123/delete
 * Access: Only poll creator with valid authentication
 */
export default async function DeletePollPage({ params }: { params: Promise<{ id: string }> }) {
  // Extract poll ID from Next.js dynamic route parameters
  const { id } = await params;
  
  // Fetch minimal poll details for deletion confirmation
  const poll = await getPollDetails(id);

  // Handle non-existent or inaccessible polls
  // Triggers Next.js 404 page for better UX
  if (!poll) {
    notFound();
  }

  // Get current user for ownership verification
  // Uses server-side Supabase client for secure auth check
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Enforce ownership-based authorization for deletion
  // Redirects unauthorized users to prevent unauthorized deletions
  if (!user || poll.created_by !== user.id) {
    redirect('/polls');
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 max-w-4xl">
      {/* Navigation back to polls list */}
      <BackButton />

      {/* Delete confirmation card with destructive styling */}
      <Card>
        <CardHeader>
          {/* Red title to indicate destructive action */}
          <CardTitle className="text-red-600">Delete Poll</CardTitle>
          <CardDescription>Are you sure you want to delete this poll?</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Poll information for user confirmation */}
          <div className="mb-6">
            {/* Display poll title for clear identification */}
            <h3 className="font-semibold mb-2">{poll.title}</h3>
            
            {/* Show description if available for additional context */}
            {poll.description && (
              <p className="text-muted-foreground">{poll.description}</p>
            )}
            
            {/* Clear warning about permanent deletion consequences */}
            <p className="text-sm text-muted-foreground mt-2">
              This action cannot be undone. All votes and options will be permanently deleted.
            </p>
          </div>
          
          {/* Delete form with confirmation and cancel options */}
          <DeletePollForm pollId={poll.id} />
        </CardContent>
      </Card>
    </div>
  );
}
