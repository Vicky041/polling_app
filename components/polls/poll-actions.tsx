'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { deletePoll } from '@/lib/actions';

interface PollActionsProps {
  pollId: string;
  createdBy: string;
}

export default function PollActions({ pollId, createdBy }: PollActionsProps) {
  const router = useRouter();
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // For now, we'll use a simple check - in a real app, this would come from auth context
  const isCurrentUser = createdBy === 'anonymous'; // TODO: Replace with actual user ID from auth
  
  const handleEdit = () => {
    router.push(`/polls/${pollId}/edit`);
  };
  
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this poll? This action cannot be undone.')) {
      return;
    }
    
    setIsDeleting(true);
    try {
      await deletePoll(pollId);
      router.refresh(); // Refresh the page to show updated polls
    } catch (error) {
      console.error('Failed to delete poll:', error);
      alert('Failed to delete poll. Please try again.');
    } finally {
      setIsDeleting(false);
      setShowDeleteAlert(false);
    }
  };
  
  if (!isCurrentUser) {
    return null; // Don't show actions for polls not created by current user
  }
  
  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Poll
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => setShowDeleteAlert(true)}
            className="text-red-600 focus:text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Poll
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      {showDeleteAlert && (
        <div className="absolute right-0 top-10 z-50 w-64">
          <Alert variant="destructive">
            <AlertDescription className="mb-3">
              Are you sure you want to delete this poll? This action cannot be undone.
            </AlertDescription>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => setShowDeleteAlert(false)}
              >
                Cancel
              </Button>
              <Button 
                size="sm" 
                variant="destructive" 
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </Alert>
        </div>
      )}
    </div>
  );
}
