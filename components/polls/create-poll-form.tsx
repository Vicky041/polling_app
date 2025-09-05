'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { createPoll } from '@/lib/actions';

/**
 * Represents a poll option during creation
 * @interface PollOption
 */
type PollOption = {
  /** Unique identifier for the option (temporary during creation) */
  id: string;
  /** Text content of the poll option */
  text: string;
};

/**
 * Interactive form component for creating new polls
 * 
 * Provides a comprehensive interface for poll creation including title,
 * description, and dynamic option management. Features client-side validation,
 * error handling, and automatic redirection upon successful creation.
 * 
 * @component
 * @returns {JSX.Element} Rendered poll creation form
 * 
 * @features
 * - Dynamic option management (add/remove options)
 * - Real-time client-side validation
 * - Form submission with loading states
 * - Error and success message display
 * - Automatic redirection after creation
 * - Minimum 2 options requirement
 * - Responsive card-based layout
 * 
 * @example
 * ```tsx
 * <CreatePollForm />
 * // Renders a complete poll creation interface
 * ```
 * 
 * @validation
 * - Poll title is required and cannot be empty
 * - Minimum 2 non-empty options required
 * - Trims whitespace from all inputs
 * - Filters out empty options before submission
 * 
 * @workflow
 * 1. User fills in poll title and description
 * 2. User adds/removes options as needed
 * 3. Client-side validation on submission
 * 4. Server action called with form data
 * 5. Success message and automatic redirect
 */
export default function CreatePollForm() {
  const router = useRouter();
  
  // Form state management
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [options, setOptions] = useState<PollOption[]>([
    { id: '1', text: '' }, // Default first option
    { id: '2', text: '' }, // Default second option
  ]);
  
  // UI state management
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  /**
   * Adds a new empty option to the poll
   * 
   * Creates a new option with a timestamp-based ID and empty text,
   * allowing users to dynamically expand their poll options.
   * 
   * @function handleAddOption
   * @returns {void}
   */
  const handleAddOption = () => {
    // Use timestamp for unique temporary ID
    setOptions([...options, { id: `${Date.now()}`, text: '' }]);
  };

  /**
   * Removes a specific option from the poll
   * 
   * Filters out the option with the given ID, but enforces a minimum
   * of 2 options to maintain poll validity.
   * 
   * @function handleRemoveOption
   * @param {string} id - Unique identifier of the option to remove
   * @returns {void}
   */
  const handleRemoveOption = (id: string) => {
    // Enforce minimum 2 options requirement
    if (options.length <= 2) return;
    setOptions(options.filter(option => option.id !== id));
  };

  /**
   * Updates the text content of a specific option
   * 
   * Finds the option by ID and updates its text content while
   * preserving all other options unchanged.
   * 
   * @function handleOptionChange
   * @param {string} id - Unique identifier of the option to update
   * @param {string} text - New text content for the option
   * @returns {void}
   */
  const handleOptionChange = (id: string, text: string) => {
    setOptions(options.map(option => {
      if (option.id === id) {
        return { ...option, text };
      }
      return option;
    }));
  };

  /**
   * Handles form submission with validation and server communication
   * 
   * Performs client-side validation, processes form data, calls the server
   * action for poll creation, and manages UI feedback and redirection.
   * 
   * @async
   * @function handleSubmit
   * @param {FormData} formData - Form data from the submission
   * @returns {Promise<void>} Completes when submission is processed
   * 
   * @throws {Error} When poll creation fails on the server
   * 
   * @validation
   * - Ensures poll title is not empty after trimming
   * - Validates minimum 2 non-empty options
   * - Filters out empty options before submission
   * 
   * @sideEffects
   * - Updates UI state (loading, error, success)
   * - Redirects to polls page on success
   * - Displays error messages on failure
   */
  const handleSubmit = async (formData: FormData) => {
    // Reset UI state
    setError(null);
    setSuccess(null);
    
    // Client-side validation: check poll title
    if (!title.trim()) {
      setError('Please enter a poll title');
      return;
    }
    
    // Client-side validation: check minimum options
    const validOptions = options.filter(opt => opt.text.trim());
    if (validOptions.length < 2) {
      setError('Please enter at least 2 poll options');
      return;
    }
    
    // Set loading state
    setIsSubmitting(true);
    
    try {
      // Prepare options data for server action
      formData.append('options', JSON.stringify(validOptions));
      
      // Submit to server via server action
      await createPoll(formData);
      
      // Display success feedback
      setSuccess('Poll created successfully! Redirecting...');
      
      // Delayed redirect to show success message
      setTimeout(() => {
        router.push('/polls');
      }, 1500);
      
    } catch (error) {
      // Log error for debugging
      console.error('Failed to create poll:', error);
      
      // Display user-friendly error message
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
          
          {success && (
            <Alert variant="success">
              <AlertDescription>{success}</AlertDescription>
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
          <Button type="submit" className="w-full" disabled={isSubmitting || !!success}>
            {isSubmitting ? 'Creating Poll...' : success ? 'Poll Created!' : 'Create Poll'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
