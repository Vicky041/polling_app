import { notFound, redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import BackButton from '@/components/shared/back-button';
import EditPollForm from '@/components/polls/edit-poll-form';
import { createServerSupabaseClient } from '@/lib/supabase-server';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

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
  totalVotes: number;
};

async function getPollDetails(pollId: string): Promise<PollDetail | null> {
  try {
    const supabase = createServerSupabaseClient();
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

    const options = poll.poll_options?.map((option: any) => ({
      id: option.id,
      text: option.text,
      votes: option.votes || 0,
    })) || [];

    const totalVotes = options.reduce((sum, option) => sum + option.votes, 0);

    return {
      id: poll.id,
      title: poll.title,
      description: poll.description || '',
      created_by: poll.created_by,
      created_at: new Date(poll.created_at).toLocaleDateString(),
      options,
      totalVotes,
    };
  } catch (error) {
    console.error('Error fetching poll details:', error);
    return null;
  }
}

export default async function EditPollPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const poll = await getPollDetails(id);

  if (!poll) {
    notFound();
  }

  // For now, allow editing if created by 'anonymous' - in a real app, check actual user
  if (poll.created_by !== 'anonymous') {
    redirect('/polls');
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 max-w-4xl">
      <BackButton />

      <Card>
        <CardHeader>
          <CardTitle>Edit Poll</CardTitle>
          <CardDescription>Modify your poll details and options</CardDescription>
        </CardHeader>
        <CardContent>
          <EditPollForm poll={poll} />
        </CardContent>
      </Card>
    </div>
  );
}
