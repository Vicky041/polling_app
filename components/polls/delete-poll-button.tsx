'use client';

import { Button } from '@/components/ui/button';
import { deletePoll } from '@/lib/actions';

export default function DeletePollButton({ pollId }: { pollId: string }) {
  const handleDelete = async () => {
    await deletePoll(pollId);
  };

  return (
    <Button variant="destructive" onClick={handleDelete}>
      Delete Poll
    </Button>
  );
}
