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
    if (hasVoted) {
      const timer = setTimeout(() => {
        router.push('/polls');
      }, 2000); // Wait 2 seconds to show the success message

      return () => clearTimeout(timer);
    }
  }, [hasVoted, router]);

  const handleVote = async () => {
    if (!selectedOption) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await submitVote(pollId, selectedOption);
      
      // Update local state to reflect vote
      const updatedOptions = localOptions.map(option => {
        if (option.id === selectedOption) {
          return { ...option, votes: option.votes + 1 };
        }
        return option;
      });

      setLocalOptions(updatedOptions);
      setLocalTotalVotes(localTotalVotes + 1);
      setHasVoted(true);
    } catch (error) {
      console.error('Failed to submit vote:', error);
      setError('Failed to submit vote. Please try again.');
    } finally {
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

      {!hasVoted ? (
        <Button 
          onClick={handleVote} 
          disabled={!selectedOption || isSubmitting}
          className="w-full"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Vote'}
        </Button>
      ) : (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <div className="font-semibold mb-1">Vote submitted successfully!</div>
            <div className="text-sm">
              Thank you for participating. Total votes: <span className="font-medium">{localTotalVotes}</span>
            </div>
            <div className="text-xs text-green-600 mt-2">
              Redirecting to polls dashboard in 2 seconds...
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
