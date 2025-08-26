'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type PollOption = {
  id: string;
  text: string;
  votes: number;
};

type PollDetail = {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  createdAt: string;
  options: PollOption[];
  totalVotes: number;
};

export default function PollDetailPage() {
  const params = useParams();
  const router = useRouter();
  const pollId = params.id as string;
  
  const [poll, setPoll] = useState<PollDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    // Simulate fetching poll details
    const fetchPollDetails = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock poll data
        setPoll({
          id: pollId,
          title: 'Favorite Programming Language',
          description: 'What is your favorite programming language for web development?',
          createdBy: 'John Doe',
          createdAt: '2023-05-15',
          options: [
            { id: 'opt1', text: 'JavaScript', votes: 25 },
            { id: 'opt2', text: 'TypeScript', votes: 18 },
            { id: 'opt3', text: 'Python', votes: 12 },
            { id: 'opt4', text: 'Go', votes: 8 },
          ],
          totalVotes: 63,
        });
      } catch (error) {
        console.error('Failed to fetch poll details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (pollId) {
      fetchPollDetails();
    }
  }, [pollId]);

  const handleVote = async () => {
    if (!selectedOption) return;

    try {
      // Simulate API call to submit vote
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update local state to reflect vote
      if (poll) {
        const updatedOptions = poll.options.map(option => {
          if (option.id === selectedOption) {
            return { ...option, votes: option.votes + 1 };
          }
          return option;
        });

        setPoll({
          ...poll,
          options: updatedOptions,
          totalVotes: poll.totalVotes + 1,
        });

        setHasVoted(true);
      }
    } catch (error) {
      console.error('Failed to submit vote:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading poll...</div>;
  }

  if (!poll) {
    return <div className="flex justify-center items-center min-h-screen">Poll not found</div>;
  }

  const calculatePercentage = (votes: number) => {
    if (poll.totalVotes === 0) return 0;
    return Math.round((votes / poll.totalVotes) * 100);
  };

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <Button variant="outline" className="mb-6" onClick={() => router.back()}>
        ← Back to Polls
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>{poll.title}</CardTitle>
          <CardDescription>Created by {poll.createdBy} on {poll.createdAt}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-6">{poll.description}</p>

          <div className="space-y-4">
            {poll.options.map((option) => (
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
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div
                    className="bg-primary h-2.5 rounded-full"
                    style={{ width: `${calculatePercentage(option.votes)}%` }}
                  ></div>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {option.votes} {option.votes === 1 ? 'vote' : 'votes'}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          {!hasVoted ? (
            <Button 
              onClick={handleVote} 
              disabled={!selectedOption}
              className="w-full"
            >
              Submit Vote
            </Button>
          ) : (
            <div className="w-full text-center text-muted-foreground">
              Thank you for voting! Total votes: {poll.totalVotes}
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}