import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { createServerSupabaseClient } from '@/lib/supabase-server';

// Force dynamic rendering to ensure fresh data on each request
// This prevents stale poll data from being cached and ensures users see real-time updates
export const dynamic = 'force-dynamic';

/**
 * Type definition for poll data displayed in the dashboard
 * 
 * Represents a simplified poll object optimized for listing views,
 * containing essential information without detailed option data.
 * 
 * @interface Poll
 */
type Poll = {
  /** Unique identifier for the poll */
  id: string;
  /** Poll title/question displayed to users */
  title: string;
  /** Optional poll description providing additional context */
  description: string;
  /** User ID of the poll creator for ownership verification */
  created_by: string;
  /** Human-readable creation date string for display */
  created_at: string;
  /** Total number of votes across all poll options */
  total_votes: number;
};

/**
 * Fetches all polls with vote counts and current user information
 * 
 * This function serves as the main data source for the polls dashboard,
 * combining poll data with user authentication state to enable proper
 * ownership-based UI rendering (edit/delete buttons).
 * 
 * Features:
 * - Fetches polls ordered by creation date (newest first)
 * - Calculates total vote counts across all options
 * - Identifies current user for ownership verification
 * - Handles authentication and database errors gracefully
 * 
 * @returns Promise resolving to polls array and current user ID
 * @throws Never throws - all errors are caught and logged
 */
async function getPolls(): Promise<{ polls: Poll[], currentUserId: string | null }> {
  try {
    // Use server-side Supabase client for RLS policy enforcement
    // This ensures users only see polls they're authorized to view
    const supabase = createServerSupabaseClient();
    
    // Get current user for ownership verification
    // This determines which polls show edit/delete buttons
    const { data: { user } } = await supabase.auth.getUser();
    
    // Fetch polls with nested poll_options for vote counting
    // Using select with join to minimize database queries
    const { data: polls, error } = await supabase
      .from('polls')
      .select(`
        id,
        title,
        description,
        created_by,
        created_at,
        poll_options (votes)
      `)
      .order('created_at', { ascending: false }); // Newest polls first for better UX

    if (error) {
      console.error('Error fetching polls:', error);
      // Return empty state but preserve user info for UI consistency
      return { polls: [], currentUserId: user?.id || null };
    }

    // Transform database response to match our Poll type
    // This normalizes data and calculates derived fields
    const transformedPolls = polls?.map(poll => ({
      id: poll.id,
      title: poll.title,
      description: poll.description || '', // Handle null descriptions
      created_by: poll.created_by,
      // Format date for display - converts ISO string to locale-specific format
      created_at: new Date(poll.created_at).toLocaleDateString(),
      // Calculate total votes across all options
      // Using reduce to sum votes, with fallbacks for missing data
      total_votes: poll.poll_options?.reduce((sum: number, option: any) => sum + (option.votes || 0), 0) || 0,
    })) || []; // Fallback to empty array if polls is null
    
    return { polls: transformedPolls, currentUserId: user?.id || null };
  } catch (error) {
    // Catch-all error handler for network issues, auth failures, etc.
    console.error('Error fetching polls:', error);
    // Return safe fallback state to prevent UI crashes
    return { polls: [], currentUserId: null };
  }
}

/**
 * Main polls dashboard page component
 * 
 * This Server Component renders the primary polls listing interface,
 * providing users with an overview of all available polls and quick
 * access to voting, creation, and management actions.
 * 
 * Features:
 * - Responsive grid layout for optimal viewing on all devices
 * - Ownership-based action buttons (edit/delete for poll creators)
 * - Real-time vote counts and creation metadata
 * - Empty state with call-to-action for new users
 * - Hover effects and visual feedback for better UX
 * 
 * Security:
 * - Uses server-side data fetching with RLS policies
 * - Conditional rendering based on user ownership
 * - No sensitive data exposed to client-side
 * 
 * @returns JSX element representing the polls dashboard
 */
export default async function PollsPage() {
  // Fetch polls and user data server-side for optimal performance
  // This ensures fresh data and proper authentication state
  const { polls, currentUserId } = await getPolls();

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 max-w-4xl">
      {/* Header section with title and primary action */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">All Polls</h1>
        {/* Always show create button to encourage engagement */}
        <Link href="/polls/create">
          <Button>Create New Poll</Button>
        </Link>
      </div>

      {/* Responsive grid layout for poll cards */}
      {/* Single column on mobile, two columns on medium+ screens */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {polls.map((poll) => (
          <Card key={poll.id} className="h-full hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">{poll.title}</CardTitle>
              <CardDescription>
                {/* Display creator and creation date for context */}
                Created by {poll.created_by} on {poll.created_at}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Truncate long descriptions to maintain card consistency */}
              <p className="line-clamp-2 text-sm text-muted-foreground">
                {poll.description || 'No description provided'}
              </p>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              {/* Show vote count to indicate poll popularity */}
              <p className="text-sm text-muted-foreground">{poll.total_votes} votes</p>
              <div className="flex gap-2">
                {/* Primary action - always available for all users */}
                <Link href={`/polls/${poll.id}`}>
                  <Button variant="outline" size="sm">
                    View & Vote
                  </Button>
                </Link>
                {/* Ownership-based actions - only show to poll creators */}
                {/* This prevents unauthorized access attempts and reduces UI clutter */}
                {poll.created_by === currentUserId && (
                  <>
                    <Link href={`/polls/${poll.id}/edit`}>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                    <Link href={`/polls/${poll.id}/delete`}>
                      {/* Red styling to indicate destructive action */}
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        Delete
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Empty state with encouraging call-to-action */}
      {/* Only shown when no polls exist to avoid confusion */}
      {polls.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground mb-4">No polls found</p>
          <p className="text-sm text-muted-foreground mb-6">
            Be the first to create a poll and start gathering opinions!
          </p>
          {/* Larger button to draw attention and encourage first poll creation */}
          <Link href="/polls/create">
            <Button size="lg">Create Your First Poll</Button>
          </Link>
        </div>
      )}
    </div>
  );
}