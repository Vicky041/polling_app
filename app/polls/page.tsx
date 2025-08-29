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

async function getPolls(): Promise<Poll[]> {
  try {
    const supabase = createServerSupabaseClient();
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
      return [];
    }

    // Transform the data to match our Poll type
    return polls?.map(poll => ({
      id: poll.id,
      title: poll.title,
      description: poll.description || '',
      created_by: poll.created_by,
      created_at: new Date(poll.created_at).toLocaleDateString(),
      total_votes: poll.poll_options?.reduce((sum: number, option: any) => sum + (option.votes || 0), 0) || 0,
    })) || [];
  } catch (error) {
    console.error('Error fetching polls:', error);
    return [];
  }
}

export default async function PollsPage() {
  const polls = await getPolls();

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
                <CardDescription>Created by {poll.created_by} on {poll.created_at}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-2">{poll.description}</p>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">{poll.total_votes} votes</p>
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