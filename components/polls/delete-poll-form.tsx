'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { deletePoll } from '@/lib/actions';

/**
 * Props for the DeletePollForm component
 * @interface DeletePollFormProps
 */
interface DeletePollFormProps {
  /** Unique identifier of the poll to be deleted */
  pollId: string;
}

/**
 * Confirmation component for poll deletion
 * 
 * Provides a simple interface with cancel and delete buttons for poll removal.
 * Handles the deletion process with loading states and error handling.
 * 
 * @component
 * @param {DeletePollFormProps} props - Component props
 * @param {string} props.pollId - Unique identifier of the poll to delete
 * @returns {JSX.Element} Rendered deletion confirmation buttons
 * 
 * @features
 * - Confirmation-based deletion (no accidental clicks)
 * - Loading state during deletion process
 * - Error handling with user feedback
 * - Automatic redirection after successful deletion
 * - Cancel functionality to abort deletion
 * - Disabled state during processing
 * 
 * @example
 * ```tsx
 * <DeletePollForm pollId="poll-123" />
 * // Renders cancel and delete buttons
 * ```
 * 
 * @security
 * - Only poll owners can delete their polls (enforced server-side)
 * - Cascading deletion of all related data (votes, options)
 * - Irreversible operation with proper user warning
 * 
 * @workflow
 * 1. User clicks delete button
 * 2. Loading state activated, buttons disabled
 * 3. Server action called for poll deletion
 * 4. Success: redirect to polls page
 * 5. Error: show alert and re-enable buttons
 * 
 * @accessibility
 * - Proper button labeling and states
 * - Keyboard navigation support
 * - Clear visual feedback for actions
 */
export default function DeletePollForm({ pollId }: DeletePollFormProps) {
  const router = useRouter();
  
  // Track deletion process state
  const [isDeleting, setIsDeleting] = useState(false);

  /**
   * Handles poll deletion with error handling and redirection
   * 
   * Initiates the deletion process, manages loading state, and handles
   * both success and error scenarios appropriately.
   * 
   * @async
   * @function handleDelete
   * @returns {Promise<void>} Completes when deletion is processed
   * 
   * @throws {Error} When poll deletion fails on the server
   * 
   * @sideEffects
   * - Sets loading state during deletion
   * - Redirects to polls page on success
   * - Shows alert on error and resets loading state
   * - Permanently deletes poll and all associated data
   * 
   * @warning This operation is irreversible and deletes all poll data
   */
  const handleDelete = async () => {
    // Set loading state and disable buttons
    setIsDeleting(true);
    
    try {
      // Call server action to delete poll and all related data
      await deletePoll(pollId);
      
      // Redirect to polls page on successful deletion
      router.push('/polls');
    } catch (error) {
      // Log error for debugging
      console.error('Failed to delete poll:', error);
      
      // Show user-friendly error message
      alert('Failed to delete poll. Please try again.');
      
      // Re-enable buttons for retry
      setIsDeleting(false);
    }
  };

  /**
   * Handles cancellation of the deletion process
   * 
   * Redirects the user back to the polls page without performing
   * any deletion operation.
   * 
   * @function handleCancel
   * @returns {void}
   */
  const handleCancel = () => {
    // Navigate back to polls page without deleting
    router.push('/polls');
  };

  return (
    <div className="flex gap-3">
      <Button 
        variant="outline" 
        onClick={handleCancel}
        disabled={isDeleting}
      >
        Cancel
      </Button>
      <Button 
        variant="destructive" 
        onClick={handleDelete}
        disabled={isDeleting}
      >
        {isDeleting ? 'Deleting...' : 'Delete Poll'}
      </Button>
    </div>
  );
}
