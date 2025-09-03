import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createPoll } from '@/lib/actions';
import Link from 'next/link';

// Server action to process form data and create poll
async function handleCreatePoll(formData: FormData) {
  'use server';
  
  // Get all option inputs and filter out empty ones
  const options = [];
  let optionIndex = 0;
  while (formData.get(`option-${optionIndex}`)) {
    const optionText = formData.get(`option-${optionIndex}`) as string;
    if (optionText.trim()) {
      options.push({ text: optionText.trim() });
    }
    optionIndex++;
  }
  
  // Create new FormData with the processed options for the createPoll action
  const processedFormData = new FormData();
  processedFormData.append('title', formData.get('title') as string);
  processedFormData.append('description', formData.get('description') as string);
  processedFormData.append('options', JSON.stringify(options));
  
  // Call the main createPoll action which handles validation, database operations, and redirect
  await createPoll(processedFormData);
}

export default function CreatePollPage() {
  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 max-w-4xl">
      <Link href="/polls">
        <Button variant="outline" className="mb-6">
          ← Back
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Create New Poll</CardTitle>
          <CardDescription>Fill in the details to create your poll</CardDescription>
        </CardHeader>
        <form action={handleCreatePoll}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="title" className="font-medium">Poll Title</label>
              <Input
                id="title"
                name="title"
                placeholder="Enter a question for your poll"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="font-medium">Description (Optional)</label>
              <Input
                id="description"
                name="description"
                placeholder="Add more context to your question"
              />
            </div>

            <div className="space-y-4">
              <label className="font-medium">Poll Options</label>
              
              <div className="space-y-2">
                <Input
                  name="option-0"
                  placeholder="Option 1"
                  required
                />
                <Input
                  name="option-1"
                  placeholder="Option 2"
                  required
                />
                <Input
                  name="option-2"
                  placeholder="Option 3 (optional)"
                />
                <Input
                  name="option-3"
                  placeholder="Option 4 (optional)"
                />
                <Input
                  name="option-4"
                  placeholder="Option 5 (optional)"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Create Poll
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}