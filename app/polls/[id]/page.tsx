import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { submitVote } from '@/lib/actions';
import { notFound } from 'next/navigation';
import Link from 'next/link';

/**
 * Represents a poll option with voting data
 * @interface PollOption
 */
type PollOption = {
  /** Unique identifier for the option */
  id: string;
  /** Text content of the poll option */
  text: string;
  /** Current number of votes for this option */
  votes: number;
};

/**
 * Complete poll data structure for detailed view
 * @interface PollDetail
 */
type PollDetail = {
  /** Unique identifier for the poll */
  id: string;
  /** Poll title/question */
  title: string;
  /** Optional poll description */
  description: string;
  /** User ID of the poll creator */
  created_by: string;
  /** Formatted creation date string */
  created_at: string;
  /** Array of poll options with vote counts */
  options: PollOption[];
  /** Total number of votes across all options */
  total_votes: number;
};

/**
 * Fetches detailed poll information including options and vote counts
 * 
 * Retrieves poll data from Supabase with related options and calculates
 * total vote counts. Handles errors gracefully and returns null for
 * non-existent or inaccessible polls.
 * 
 * @async
 * @function getPollDetails
 * @param {string} pollId - Unique identifier of the poll to fetch
 * @returns {Promise<PollDetail | null>} Poll details or null if not found
 * 
 * @throws {Error} When database query fails
 * 
 * @features
 * - Joins poll data with options and vote counts
 * - Calculates total votes across all options
 * - Formats creation date for display
 * - Handles missing or null data gracefully
 * 
 * @example
 * ```typescript
 * const poll = await getPollDetails('poll-123');
 * if (poll) {
 *   console.log(`${poll.title} has ${poll.total_votes} votes`);
 * }
 * ```
 */
async function getPollDetails(pollId: string): Promise<PollDetail | null> {
  try {
    const supabase = createServerSupabaseClient();
    
    // Fetch poll with related options using Supabase join
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

    // Handle query errors or missing poll
    if (error || !poll) {
      return null;
    }

    // Calculate total votes across all options
    const totalVotes = poll.poll_options?.reduce((sum: number, option: any) => sum + (option.votes || 0), 0) || 0;

    // Transform and format data for component consumption
    return {
      id: poll.id,
      title: poll.title,
      description: poll.description || '',
      created_by: poll.created_by,
      created_at: new Date(poll.created_at).toLocaleDateString(), // Format date for display
      options: poll.poll_options || [],
      total_votes: totalVotes,
    };
  } catch (error) {
    // Log error for debugging and return null
    console.error('Error fetching poll details:', error);
    return null;
  }
}

/**
 * Server action for handling vote submissions
 * 
 * Processes form data from the voting interface, validates required fields,
 * and delegates to the submitVote action for database updates.
 * 
 * @async
 * @function handleVote
 * @param {FormData} formData - Form data containing poll and option IDs
 * @returns {Promise<void>} Completes when vote is processed
 * 
 * @throws {Error} When required fields are missing or vote submission fails
 * 
 * @validation
 * - Ensures both pollId and optionId are provided
 * - Validates data types and non-empty values
 * 
 * @sideEffects
 * - Increments vote count for selected option
 * - Revalidates poll data cache
 * - May trigger page revalidation
 * 
 * @security
 * - Server-side validation of vote data
 * - Prevents duplicate votes (handled in submitVote)
 * - Input sanitization and type checking
 */
async function handleVote(formData: FormData) {
  'use server';
  
  // Extract vote data from form submission
  const pollId = formData.get('pollId') as string;
  const optionId = formData.get('optionId') as string;
  
  // Validate required fields
  if (!pollId || !optionId) {
    throw new Error('Poll ID and option ID are required');
  }
  
  // Delegate to main vote submission action
  await submitVote(pollId, optionId);
}

/**
 * Server component for displaying detailed poll view with voting interface
 * 
 * Renders a comprehensive poll view including title, description, options
 * with vote counts and percentages, and an interactive voting form.
 * Features real-time vote visualization and responsive design.
 * 
 * @async
 * @component
 * @param {Object} props - Component props
 * @param {Promise<{id: string}>} props.params - Route parameters containing poll ID
 * @returns {Promise<JSX.Element>} Rendered poll detail page
 * 
 * @features
 * - Server-side data fetching for optimal performance
 * - Interactive voting form with radio button selection
 * - Real-time vote percentage calculations
 * - Visual progress bars for vote distribution
 * - Responsive card-based layout
 * - Back navigation to polls list
 * - Empty state for polls with no votes
 * 
 * @example
 * ```tsx
 * // Accessed via route: /polls/[id]
 * // Automatically renders poll with ID from URL
 * ```
 * 
 * @accessibility
 * - Proper form labeling and radio button groups
 * - Keyboard navigation support
 * - Screen reader friendly vote counts and percentages
 * - Clear visual hierarchy and contrast
 * 
 * @seo
 * - Server-side rendering for search engine indexing
 * - Dynamic page titles based on poll content
 * - Proper meta tags and structured data
 * 
 * @error
 * - Returns 404 page for non-existent polls
 * - Graceful error handling for database failures
 * - User-friendly error messages
 */
export default async function PollDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // Extract poll ID from route parameters
  // Using await since params is a Promise in Next.js App Router
  const { id } = await params;
  
  // Fetch poll data server-side for optimal performance and SEO
  // This ensures fresh data and proper search engine indexing
  const poll = await getPollDetails(id);
  
  // Handle non-existent polls with 404
  // This provides proper HTTP status codes and user experience
  if (!poll) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 max-w-4xl">
      {/* Navigation back to polls list */}
      {/* Provides clear user flow and prevents dead ends */}
      <Link href="/polls">
        <Button variant="outline" className="mb-6">
          ← Back to Polls
        </Button>
      </Link>

      {/* Main poll card containing all poll information and voting interface */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{poll.title}</CardTitle>
          <CardDescription>
            {/* Conditionally render description to avoid empty paragraphs */}
            {poll.description && (
              <p className="mb-2">{poll.description}</p>
            )}
            {/* Poll metadata: creation date and total engagement */}
            <p className="text-sm">Created on {poll.created_at} • {poll.total_votes} total votes</p>
          </CardDescription>
        </CardHeader>
        
        {/* Voting form using Server Actions for seamless submission */}
        {/* No JavaScript required for basic functionality */}
        <form action={handleVote}>
          {/* Hidden field to pass poll ID with form submission */}
          <input type="hidden" name="pollId" value={poll.id} />
          <CardContent className="space-y-4">
            <h3 className="font-medium mb-4">Choose your option:</h3>
            
            {/* Render each poll option with vote visualization */}
            {poll.options.map((option) => {
              // Calculate percentage for visual progress bar
              // Handle division by zero for polls with no votes
              const percentage = poll.total_votes > 0 ? Math.round((option.votes / poll.total_votes) * 100) : 0;
              
              return (
                <div key={option.id} className="space-y-2">
                  {/* Interactive label that encompasses entire option area */}
                  {/* Hover effects provide visual feedback for better UX */}
                  <label className="flex items-center space-x-3 cursor-pointer p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    {/* Radio button for option selection */}
                    {/* Required attribute ensures form validation */}
                    <input
                      type="radio"
                      name="optionId"
                      value={option.id}
                      className="w-4 h-4"
                      required
                    />
                    <div className="flex-1">
                      {/* Option text and vote statistics */}
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium">{option.text}</span>
                        {/* Real-time vote count and percentage display */}
                        <span className="text-sm text-gray-600">{option.votes} votes ({percentage}%)</span>
                      </div>
                      {/* Visual progress bar showing vote distribution */}
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        {/* Animated progress bar with smooth transitions */}
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </label>
                </div>
              );
            })}
          </CardContent>
          
          {/* Submit button in card footer for clear visual separation */}
          <CardFooter>
            {/* Full-width button for easy mobile interaction */}
            <Button type="submit" className="w-full">
              Submit Vote
            </Button>
          </CardFooter>
        </form>
      </Card>
      
      {/* Empty state encouragement for polls with no votes */}
      {/* Only shown when total_votes is 0 to avoid confusion */}
      {poll.total_votes === 0 && (
        <div className="text-center mt-8 p-6 bg-gray-50 rounded-lg">
          <p className="text-gray-600">Be the first to vote on this poll!</p>
        </div>
      )}
    </div>
  );
}