'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { submitVote } from '@/lib/actions';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle } from 'lucide-react';

type PollOption = {
  id: string;
  text: string;
  votes: number;
};

type PollVotingFormProps = {
  pollId: string;
  options: PollOption[];
  totalVotes: number;
};

export default function PollVotingForm({ pollId, options, totalVotes }: PollVotingFormProps) {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localOptions, setLocalOptions] = useState(options);
  const [localTotalVotes, setLocalTotalVotes] = useState(totalVotes);

  // Redirect to polls dashboard after voting
  useEffect(() => {
    console.log('useEffect triggered, hasVoted:', hasVoted);
    if (hasVoted) {
      console.log('hasVoted is true, setting redirect timer');
      const timer = setTimeout(() => {
        console.log('Timer expired, redirecting to /polls');
        router.push('/polls');
      }, 2000); // Wait 2 seconds to show the success message

      return () => {
        console.log('Cleaning up redirect timer');
        clearTimeout(timer);
      };
    }
  }, [hasVoted, router]);

  const handleVote = async () => {
    if (!selectedOption) {
      console.log('No option selected');
      return;
    }

    console.log('Starting vote submission process');
    setIsSubmitting(true);
    setError(null);

    try {
      console.log('Submitting vote for option:', selectedOption, 'in poll:', pollId);
      const result = await submitVote(pollId, selectedOption);
      console.log('Vote submitted successfully, result:', result);
      
      // Update local state to reflect vote
      const updatedOptions = localOptions.map(option => {
        if (option.id === selectedOption) {
          return { ...option, votes: option.votes + 1 };
        }
        return option;
      });

      console.log('Updating local state');
      setLocalOptions(updatedOptions);
      setLocalTotalVotes(localTotalVotes + 1);
      
      console.log('Setting hasVoted to true');
      setHasVoted(true);
      console.log('hasVoted state updated');
    } catch (error) {
      console.error('Failed to submit vote - detailed error:', error);
      console.error('Error type:', typeof error);
      console.error('Error message:', error instanceof Error ? error.message : String(error));
      setError(`Failed to submit vote: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      console.log('Vote submission process completed, setting isSubmitting to false');
      setIsSubmitting(false);
    }
  };

  const calculatePercentage = (votes: number) => {
    if (localTotalVotes === 0) return 0;
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
