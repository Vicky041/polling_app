'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { updatePoll } from '@/lib/actions';

/**
 * Represents a poll option with voting data
 * @interface PollOption
 */
type PollOption = {
  /** Unique identifier for the option */
  id: string;
  /** Text content of the poll option */
  text: string;
  /** Current number of votes for this option */
  votes: number;
};

/**
 * Complete poll data structure
 * @interface Poll
 */
type Poll = {
  /** Unique identifier for the poll */
  id: string;
  /** Poll title/question */
  title: string;
  /** Optional poll description */
  description: string;
  /** User ID of the poll creator */
  created_by: string;
  /** ISO timestamp of poll creation */
  created_at: string;
  /** Array of poll options with vote counts */
  options: PollOption[];
  /** Total number of votes across all options */
  totalVotes: number;
};

/**
 * Props for the EditPollForm component
 * @interface EditPollFormProps
 */
interface EditPollFormProps {
  /** The poll data to be edited */
  poll: Poll;
}

/**
 * Interactive form component for editing existing polls
 * 
 * Provides a comprehensive interface for modifying poll details including
 * title, description, and options. Preserves existing vote counts while
 * allowing structural changes to the poll.
 * 
 * @component
 * @param {EditPollFormProps} props - Component props
 * @param {Poll} props.poll - The poll data to be edited
 * @returns {JSX.Element} Rendered poll editing form
 * 
 * @features
 * - Pre-populated form fields with existing poll data
 * - Dynamic option management (add/remove/edit options)
 * - Vote count preservation during edits
 * - Client-side validation before submission
 * - Error handling and success feedback
 * - Automatic redirection after successful update
 * - Cancel functionality to abort changes
 * 
 * @example
 * ```tsx
 * <EditPollForm poll={existingPoll} />
 * // Renders an editable form with current poll data
 * ```
 * 
 * @validation
 * - Poll title is required and cannot be empty
 * - Minimum 2 non-empty options required
 * - Trims whitespace from all inputs
 * - Preserves vote counts for existing options
 * 
 * @workflow
 * 1. Form pre-populated with existing poll data
 * 2. User modifies title, description, or options
 * 3. Client-side validation on submission
 * 4. Server action called with updated data
 * 5. Success message and automatic redirect
 * 
 * @security
 * - Only poll owners can edit their polls (enforced server-side)
 * - Input sanitization and validation
 * - XSS protection through proper escaping
 */
export default function EditPollForm({ poll }: EditPollFormProps) {
  const router = useRouter();
  
  // Form state initialized with existing poll data
  const [title, setTitle] = useState(poll.title);
  const [description, setDescription] = useState(poll.description);
  const [options, setOptions] = useState<PollOption[]>(poll.options);
  
  // UI state management
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  /**
   * Adds a new empty option to the poll
   * 
   * Creates a new option with a unique ID, empty text, and zero votes.
   * New options are marked with 'new_' prefix for server-side handling.
   * 
   * @function handleAddOption
   * @returns {void}
   */
  const handleAddOption = () => {
    // Create new option with unique ID and zero votes
    setOptions([...options, { id: `new_${Date.now()}`, text: '', votes: 0 }]);
  };

  /**
   * Removes a specific option from the poll
   * 
   * Filters out the option with the given ID, but enforces a minimum
   * of 2 options. Note: Removing options with existing votes will
   * permanently delete those votes.
   * 
   * @function handleRemoveOption
   * @param {string} id - Unique identifier of the option to remove
   * @returns {void}
   * 
   * @warning Removing options with votes will permanently delete vote data
   */
  const handleRemoveOption = (id: string) => {
    // Enforce minimum 2 options requirement
    if (options.length <= 2) return;
    setOptions(options.filter(option => option.id !== id));
  };

  /**
   * Updates the text content of a specific option
   * 
   * Finds the option by ID and updates its text content while
   * preserving the vote count and other properties.
   * 
   * @function handleOptionChange
   * @param {string} id - Unique identifier of the option to update
   * @param {string} text - New text content for the option
   * @returns {void}
   */
  const handleOptionChange = (id: string, text: string) => {
    setOptions(options.map(option => {
      if (option.id === id) {
        // Update text while preserving votes and other properties
        return { ...option, text };
      }
      return option;
    }));
  };

  /**
   * Handles form submission with validation and server communication
   * 
   * Performs client-side validation, processes form data, calls the server
   * action for poll updates, and manages UI feedback and redirection.
   * 
   * @async
   * @function handleSubmit
   * @param {React.FormEvent} e - Form submission event
   * @returns {Promise<void>} Completes when submission is processed
   * 
   * @throws {Error} When poll update fails on the server
   * 
   * @validation
   * - Ensures poll title is not empty after trimming
   * - Validates minimum 2 non-empty options
   * - Filters out empty options before submission
   * - Preserves vote counts for existing options
   * 
   * @sideEffects
   * - Updates UI state (loading, error, success)
   * - Redirects to polls page on success
   * - Displays error messages on failure
   */
  const handleSubmit = async (e: React.FormEvent) => {
    // Prevent default form submission
    e.preventDefault();
    
    // Reset UI state
    setError(null);
    setSuccess(null);
    
    // Client-side validation: check poll title
    if (!title.trim()) {
      setError('Please enter a poll title');
      return;
    }
    
    // Client-side validation: check minimum options
    const validOptions = options.filter(opt => opt.text.trim());
    if (validOptions.length < 2) {
      setError('Please enter at least 2 poll options');
      return;
    }
    
    // Set loading state
    setIsSubmitting(true);
    
    try {
      // Prepare update data with poll ID and sanitized inputs
      const updateData = {
        pollId: poll.id,
        title: title.trim(),
        description: description.trim(),
        options: validOptions // Includes vote counts for existing options
      };
      
      // Submit to server via server action
      await updatePoll(updateData);
      
      // Display success feedback
      setSuccess('Poll updated successfully! Redirecting...');
      
      // Delayed redirect to show success message
      setTimeout(() => {
        router.push('/polls');
      }, 1500);
      
    } catch (error) {
      // Log error for debugging
      console.error('Failed to update poll:', error);
      
      // Display user-friendly error message
      setError('Failed to update poll. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {success && (
        <Alert variant="success">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-2">
        <label htmlFor="title" className="font-medium">Poll Title</label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter a question for your poll"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="font-medium">Description (Optional)</label>
        <Input
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add more context to your question"
        />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="font-medium">Poll Options</label>
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={handleAddOption}
          >
            Add Option
          </Button>
        </div>
        
        {options.map((option, index) => (
          <div key={option.id} className="flex items-center gap-2">
            <Input
              value={option.text}
              onChange={(e) => handleOptionChange(option.id, e.target.value)}
              placeholder={`Option ${index + 1}`}
              required
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => handleRemoveOption(option.id)}
              disabled={options.length <= 2}
            >
              ×
            </Button>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <Button 
          type="submit" 
          className="flex-1" 
          disabled={isSubmitting || !!success}
        >
          {isSubmitting ? 'Updating Poll...' : success ? 'Poll Updated!' : 'Update Poll'}
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => router.push('/polls')}
          disabled={isSubmitting || !!success}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
