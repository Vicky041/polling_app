'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type Poll = {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  createdAt: string;
  votesCount: number;
};

export default function PollsPage() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching polls
    const fetchPolls = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock polls data
        setPolls([
          {
            id: '1',
            title: 'Favorite Programming Language',
            description: 'What is your favorite programming language?',
            createdBy: 'John Doe',
            createdAt: '2023-05-15',
            votesCount: 42,
          },
          {
            id: '2',
            title: 'Best Frontend Framework',
            description: 'Which frontend framework do you prefer?',
            createdBy: 'Jane Smith',
            createdAt: '2023-05-10',
            votesCount: 38,
          },
          {
            id: '3',
            title: 'Remote Work Preference',
            description: 'Do you prefer working remotely or in an office?',
            createdBy: 'Alex Johnson',
            createdAt: '2023-05-05',
            votesCount: 56,
          },
        ]);
      } catch (error) {
        console.error('Failed to fetch polls:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPolls();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading polls...</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">All Polls</h1>
        <Link href="/polls/create">
          <Button>Create New Poll</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {polls.map((poll) => (
          <Link key={poll.id} href={`/polls/${poll.id}`} className="block">
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>{poll.title}</CardTitle>
                <CardDescription>Created by {poll.createdBy} on {poll.createdAt}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-2">{poll.description}</p>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">{poll.votesCount} votes</p>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>

      {polls.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">No polls found</p>
          <Link href="/polls/create" className="mt-4 inline-block">
            <Button>Create Your First Poll</Button>
          </Link>
        </div>
      )}
    </div>
  );
}