'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { deletePoll } from '@/lib/actions';

interface DeletePollFormProps {
  pollId: string;
}

export default function DeletePollForm({ pollId }: DeletePollFormProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deletePoll(pollId);
      router.push('/polls');
    } catch (error) {
      console.error('Failed to delete poll:', error);
      alert('Failed to delete poll. Please try again.');
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    router.push('/polls');
  };

  return (
    <div className="flex gap-3">
      <Button 
        variant="outline" 
        onClick={handleCancel}
        disabled={isDeleting}
      >
        Cancel
      </Button>
      <Button 
        variant="destructive" 
        onClick={handleDelete}
        disabled={isDeleting}
      >
        {isDeleting ? 'Deleting...' : 'Delete Poll'}
      </Button>
    </div>
  );
}
