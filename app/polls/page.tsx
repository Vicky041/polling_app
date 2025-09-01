import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { createServerSupabaseClient } from '@/lib/supabase-server';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

type Poll = {
  id: string;
  title: string;
  description: string;
  created_by: string;
  created_at: string;
  total_votes: number;
};

async function getPolls(): Promise<{ polls: Poll[], currentUserId: string | null }> {
  try {
    const supabase = createServerSupabaseClient();
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data: polls, error } = await supabase
      .from('polls')
      .select(`
        id,
        title,
        description,
        created_by,
        created_at,
        poll_options (votes)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching polls:', error);
      return { polls: [], currentUserId: user?.id || null };
    }

    // Transform the data to match our Poll type
    const transformedPolls = polls?.map(poll => ({
      id: poll.id,
      title: poll.title,
      description: poll.description || '',
      created_by: poll.created_by,
      created_at: new Date(poll.created_at).toLocaleDateString(),
      total_votes: poll.poll_options?.reduce((sum: number, option: any) => sum + (option.votes || 0), 0) || 0,
    })) || [];
    
    return { polls: transformedPolls, currentUserId: user?.id || null };
  } catch (error) {
    console.error('Error fetching polls:', error);
    return { polls: [], currentUserId: null };
  }
}

export default async function PollsPage() {
  const { polls, currentUserId } = await getPolls();

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
          <Card key={poll.id} className="h-full hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">{poll.title}</CardTitle>
              <CardDescription>
                Created by {poll.created_by} on {poll.created_at}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="line-clamp-2 text-sm text-muted-foreground">
                {poll.description || 'No description provided'}
              </p>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">{poll.total_votes} votes</p>
              <div className="flex gap-2">
                <Link href={`/polls/${poll.id}`}>
                  <Button variant="outline" size="sm">
                    View & Vote
                  </Button>
                </Link>
                {poll.created_by === currentUserId && (
                  <>
                    <Link href={`/polls/${poll.id}/edit`}>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                    <Link href={`/polls/${poll.id}/delete`}>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        Delete
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {polls.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground mb-4">No polls found</p>
          <p className="text-sm text-muted-foreground mb-6">
            Be the first to create a poll and start gathering opinions!
          </p>
          <Link href="/polls/create">
            <Button size="lg">Create Your First Poll</Button>
          </Link>
        </div>
      )}
    </div>
  );
}