import { notFound, redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import BackButton from '@/components/shared/back-button';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import DeletePollForm from '@/components/polls/delete-poll-form';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

type Poll = {
  id: string;
  title: string;
  description: string;
  created_by: string;
};

async function getPollDetails(pollId: string): Promise<Poll | null> {
  try {
    const supabase = createServerSupabaseClient();
    const { data: poll, error } = await supabase
      .from('polls')
      .select('id, title, description, created_by')
      .eq('id', pollId)
      .single();

    if (error || !poll) {
      return null;
    }

    return {
      id: poll.id,
      title: poll.title,
      description: poll.description || '',
      created_by: poll.created_by,
    };
  } catch (error) {
    console.error('Error fetching poll details:', error);
    return null;
  }
}

export default async function DeletePollPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const poll = await getPollDetails(id);

  if (!poll) {
    notFound();
  }

  // For now, allow deletion if created by 'anonymous' - in a real app, check actual user
  if (poll.created_by !== 'anonymous') {
    redirect('/polls');
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 max-w-4xl">
      <BackButton />

      <Card>
        <CardHeader>
          <CardTitle className="text-red-600">Delete Poll</CardTitle>
          <CardDescription>Are you sure you want to delete this poll?</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h3 className="font-semibold mb-2">{poll.title}</h3>
            {poll.description && (
              <p className="text-muted-foreground">{poll.description}</p>
            )}
            <p className="text-sm text-muted-foreground mt-2">
              This action cannot be undone. All votes and options will be permanently deleted.
            </p>
          </div>
          
          <DeletePollForm pollId={poll.id} />
        </CardContent>
      </Card>
    </div>
  );
}
