'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { createPoll } from '@/lib/actions';

type PollOption = {
  id: string;
  text: string;
};

export default function CreatePollForm() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [options, setOptions] = useState<PollOption[]>([
    { id: '1', text: '' },
    { id: '2', text: '' },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddOption = () => {
    setOptions([...options, { id: `${Date.now()}`, text: '' }]);
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

  const handleSubmit = async (formData: FormData) => {
    setError(null);
    
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
      // Add options as JSON string to form data
      formData.append('options', JSON.stringify(validOptions));
      
      // Call the Server Action
      await createPoll(formData);
    } catch (error) {
      console.error('Failed to create poll:', error);
      setError('Failed to create poll. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Poll</CardTitle>
        <CardDescription>Fill in the details to create your poll</CardDescription>
      </CardHeader>
      <form action={handleSubmit}>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <label htmlFor="title" className="font-medium">Poll Title</label>
            <Input
              id="title"
              name="title"
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
              name="description"
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
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Creating Poll...' : 'Create Poll'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
