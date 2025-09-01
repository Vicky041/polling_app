import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { submitVote } from '@/lib/actions';
import { notFound } from 'next/navigation';
import Link from 'next/link';

type PollOption = {
  id: string;
  text: string;
  votes: number;
};

type PollDetail = {
  id: string;
  title: string;
  description: string;
  created_by: string;
  created_at: string;
  options: PollOption[];
  total_votes: number;
};

async function getPollDetails(pollId: string): Promise<PollDetail | null> {
  try {
    const supabase = createServerSupabaseClient();
    
    // Fetch poll with options
    const { data: poll, error } = await supabase
      .from('polls')
      .select(`
        id,
        title,
        description,
        created_by,
        created_at,
        poll_options (
          id,
          text,
          votes
        )
      `)
      .eq('id', pollId)
      .single();

    if (error || !poll) {
      return null;
    }

    const totalVotes = poll.poll_options?.reduce((sum: number, option: any) => sum + (option.votes || 0), 0) || 0;

    return {
      id: poll.id,
      title: poll.title,
      description: poll.description || '',
      created_by: poll.created_by,
      created_at: new Date(poll.created_at).toLocaleDateString(),
      options: poll.poll_options || [],
      total_votes: totalVotes,
    };
  } catch (error) {
    console.error('Error fetching poll details:', error);
    return null;
  }
}

async function handleVote(formData: FormData) {
  'use server';
  
  const pollId = formData.get('pollId') as string;
  const optionId = formData.get('optionId') as string;
  
  if (!pollId || !optionId) {
    throw new Error('Poll ID and option ID are required');
  }
  
  await submitVote(pollId, optionId);
}

export default async function PollDetailPage({ params }: { params: { id: string } }) {
  const poll = await getPollDetails(params.id);
  
  if (!poll) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 max-w-4xl">
      <Link href="/polls">
        <Button variant="outline" className="mb-6">
          ← Back to Polls
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{poll.title}</CardTitle>
          <CardDescription>
            {poll.description && (
              <p className="mb-2">{poll.description}</p>
            )}
            <p className="text-sm">Created on {poll.created_at} • {poll.total_votes} total votes</p>
          </CardDescription>
        </CardHeader>
        
        <form action={handleVote}>
          <input type="hidden" name="pollId" value={poll.id} />
          <CardContent className="space-y-4">
            <h3 className="font-medium mb-4">Choose your option:</h3>
            
            {poll.options.map((option) => {
              const percentage = poll.total_votes > 0 ? Math.round((option.votes / poll.total_votes) * 100) : 0;
              
              return (
                <div key={option.id} className="space-y-2">
                  <label className="flex items-center space-x-3 cursor-pointer p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="optionId"
                      value={option.id}
                      className="w-4 h-4"
                      required
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium">{option.text}</span>
                        <span className="text-sm text-gray-600">{option.votes} votes ({percentage}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </label>
                </div>
              );
            })}
          </CardContent>
          
          <CardFooter>
            <Button type="submit" className="w-full">
              Submit Vote
            </Button>
          </CardFooter>
        </form>
      </Card>
      
      {poll.total_votes === 0 && (
        <div className="text-center mt-8 p-6 bg-gray-50 rounded-lg">
          <p className="text-gray-600">Be the first to vote on this poll!</p>
        </div>
      )}
    </div>
  );
}