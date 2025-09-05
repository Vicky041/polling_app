'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { submitVote } from '@/lib/actions';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle } from 'lucide-react';

/**
 * Represents a single poll option with voting data
 * @interface PollOption
 */
type PollOption = {
  /** Unique identifier for the poll option */
  id: string;
  /** Display text for the option */
  text: string;
  /** Current number of votes for this option */
  votes: number;
};

/**
 * Props for the PollVotingForm component
 * @interface PollVotingFormProps
 */
type PollVotingFormProps = {
  /** Unique identifier of the poll */
  pollId: string;
  /** Array of available poll options */
  options: PollOption[];
  /** Total number of votes across all options */
  totalVotes: number;
};

/**
 * Interactive poll voting form component
 * 
 * Provides a user interface for voting on poll options with real-time
 * visual feedback, vote percentage calculations, and automatic redirection
 * after successful voting.
 * 
 * @component
 * @param {PollVotingFormProps} props - Component props
 * @returns {JSX.Element} Rendered voting form with options and progress bars
 * 
 * @features
 * - Radio button selection for poll options
 * - Real-time vote percentage calculations
 * - Visual progress bars showing vote distribution
 * - Optimistic UI updates after voting
 * - Error handling with user feedback
 * - Automatic redirection after successful vote
 * - Responsive design with accessibility support
 * 
 * @example
 * ```tsx
 * <PollVotingForm
 *   pollId="poll_123"
 *   options={[
 *     { id: "opt_1", text: "Option A", votes: 10 },
 *     { id: "opt_2", text: "Option B", votes: 5 }
 *   ]}
 *   totalVotes={15}
 * />
 * ```
 * 
 * @accessibility
 * - Uses semantic radio buttons with proper labels
 * - Keyboard navigation support
 * - Screen reader friendly progress indicators
 * 
 * @performance
 * - Optimistic updates for immediate user feedback
 * - Minimal re-renders with efficient state management
 */
export default function PollVotingForm({ pollId, options, totalVotes }: PollVotingFormProps) {
  const router = useRouter();
  
  // Voting state management
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Local state for optimistic updates
  const [localOptions, setLocalOptions] = useState(options);
  const [localTotalVotes, setLocalTotalVotes] = useState(totalVotes);

  /**
   * Effect hook to handle post-voting redirection
   * 
   * Automatically redirects users to the polls dashboard after a successful
   * vote, allowing time to display the success message and updated results.
   */
  useEffect(() => {
    console.log('useEffect triggered, hasVoted:', hasVoted);
    if (hasVoted) {
      console.log('hasVoted is true, setting redirect timer');
      // Set up delayed redirect to show success state
      const timer = setTimeout(() => {
        console.log('Timer expired, redirecting to /polls');
        router.push('/polls');
      }, 2000); // Wait 2 seconds to show the success message

      // Cleanup function to prevent memory leaks
      return () => {
        console.log('Cleaning up redirect timer');
        clearTimeout(timer);
      };
    }
  }, [hasVoted, router]);

  /**
   * Handles vote submission with optimistic UI updates
   * 
   * Submits the user's vote to the server and immediately updates the local
   * state to provide instant feedback. Includes comprehensive error handling
   * and loading states.
   * 
   * @async
   * @function handleVote
   * @returns {Promise<void>} Completes when vote is processed
   * 
   * @throws {Error} When vote submission fails
   * 
   * @sideEffects
   * - Updates local vote counts optimistically
   * - Sets voting completion state
   * - Triggers automatic redirection
   * - Displays error messages on failure
   */
  const handleVote = async () => {
    // Validate that an option is selected
    if (!selectedOption) {
      console.log('No option selected');
      return;
    }

    console.log('Starting vote submission process');
    setIsSubmitting(true);
    setError(null);

    try {
      console.log('Submitting vote for option:', selectedOption, 'in poll:', pollId);
      // Submit vote to server via server action
      const result = await submitVote(pollId, selectedOption);
      console.log('Vote submitted successfully, result:', result);
      
      // Optimistically update local state for immediate UI feedback
      const updatedOptions = localOptions.map(option => {
        if (option.id === selectedOption) {
          return { ...option, votes: option.votes + 1 };
        }
        return option;
      });

      console.log('Updating local state');
      setLocalOptions(updatedOptions);
      setLocalTotalVotes(localTotalVotes + 1);
      
      // Mark voting as complete to trigger success UI and redirection
      console.log('Setting hasVoted to true');
      setHasVoted(true);
      console.log('hasVoted state updated');
    } catch (error) {
      // Comprehensive error logging for debugging
      console.error('Failed to submit vote - detailed error:', error);
      console.error('Error type:', typeof error);
      console.error('Error message:', error instanceof Error ? error.message : String(error));
      
      // Display user-friendly error message
      setError(`Failed to submit vote: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      console.log('Vote submission process completed, setting isSubmitting to false');
      setIsSubmitting(false);
    }
  };

  /**
   * Calculates the percentage of votes for a given option
   * 
   * Computes the percentage of total votes that a specific option has received,
   * handling edge cases like zero total votes and rounding to whole numbers.
   * 
   * @function calculatePercentage
   * @param {number} votes - Number of votes for the option
   * @returns {number} Percentage as a whole number (0-100)
   * 
   * @example
   * ```typescript
   * calculatePercentage(15); // Returns 75 if total votes is 20
   * calculatePercentage(0);  // Returns 0 if no votes
   * ```
   */
  const calculatePercentage = (votes: number) => {
    // Handle division by zero case
    if (localTotalVotes === 0) return 0;
    // Round to nearest whole percentage
    return Math.round((votes / localTotalVotes) * 100);
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {localOptions.map((option) => (
        <div key={option.id} className="border rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              {!hasVoted && (
                <input
                  type="radio"
                  id={option.id}
                  name="pollOption"
                  value={option.id}
                  checked={selectedOption === option.id}
                  onChange={() => setSelectedOption(option.id)}
                  className="mr-3"
                />
              )}
              <label htmlFor={option.id} className="font-medium">{option.text}</label>
            </div>
            <span className="text-sm">{calculatePercentage(option.votes)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-2.5 rounded-full transition-all duration-500 ease-out ${
                hasVoted && selectedOption === option.id 
                  ? 'bg-green-500' 
                  : 'bg-primary'
              }`}
              style={{ width: `${calculatePercentage(option.votes)}%` }}
            ></div>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {option.votes} {option.votes === 1 ? 'vote' : 'votes'}
          </div>
        </div>
      ))}

      <Button 
        onClick={handleVote} 
        disabled={!selectedOption || isSubmitting || hasVoted}
        className="w-full"
      >
        {isSubmitting ? 'Submitting...' : hasVoted ? 'Vote Submitted' : 'Submit Vote'}
      </Button>
      
      {hasVoted && (
        <div className="w-full text-center mt-3">
          <div className="text-green-500 font-medium text-lg">
            Voting successful
          </div>
          <div className="text-green-500 font-medium text-sm mt-2">
            Total votes: {localTotalVotes}
          </div>
        </div>
      )}
    </div>
  );
}
