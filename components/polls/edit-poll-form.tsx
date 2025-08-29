'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { updatePoll } from '@/lib/actions';

type PollOption = {
  id: string;
  text: string;
  votes: number;
};

type Poll = {
  id: string;
  title: string;
  description: string;
  created_by: string;
  created_at: string;
  options: PollOption[];
  totalVotes: number;
};

interface EditPollFormProps {
  poll: Poll;
}

export default function EditPollForm({ poll }: EditPollFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(poll.title);
  const [description, setDescription] = useState(poll.description);
  const [options, setOptions] = useState<PollOption[]>(poll.options);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleAddOption = () => {
    setOptions([...options, { id: `new_${Date.now()}`, text: '', votes: 0 }]);
  };

  const handleRemoveOption = (id: string) => {
    if (options.length <= 2) return; // Minimum 2 options required
    setOptions(options.filter(option => option.id !== id));
  };

  const handleOptionChange = (id: string, text: string) => {
    setOptions(options.map(option => {
      if (option.id === id) {
        return { ...option, text };
      }
      return option;
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    // Client-side validation
    if (!title.trim()) {
      setError('Please enter a poll title');
      return;
    }
    
    const validOptions = options.filter(opt => opt.text.trim());
    if (validOptions.length < 2) {
      setError('Please enter at least 2 poll options');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare the data for update
      const updateData = {
        pollId: poll.id,
        title: title.trim(),
        description: description.trim(),
        options: validOptions
      };
      
      await updatePoll(updateData);
      
      // Show success message
      setSuccess('Poll updated successfully! Redirecting...');
      
      // Redirect to polls page after a short delay
      setTimeout(() => {
        router.push('/polls');
      }, 1500);
      
    } catch (error) {
      console.error('Failed to update poll:', error);
      setError('Failed to update poll. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {success && (
        <Alert variant="success">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-2">
        <label htmlFor="title" className="font-medium">Poll Title</label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter a question for your poll"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="font-medium">Description (Optional)</label>
        <Input
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add more context to your question"
        />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="font-medium">Poll Options</label>
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={handleAddOption}
          >
            Add Option
          </Button>
        </div>
        
        {options.map((option, index) => (
          <div key={option.id} className="flex items-center gap-2">
            <Input
              value={option.text}
              onChange={(e) => handleOptionChange(option.id, e.target.value)}
              placeholder={`Option ${index + 1}`}
              required
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => handleRemoveOption(option.id)}
              disabled={options.length <= 2}
            >
              ×
            </Button>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <Button 
          type="submit" 
          className="flex-1" 
          disabled={isSubmitting || !!success}
        >
          {isSubmitting ? 'Updating Poll...' : success ? 'Poll Updated!' : 'Update Poll'}
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => router.push('/polls')}
          disabled={isSubmitting || !!success}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
