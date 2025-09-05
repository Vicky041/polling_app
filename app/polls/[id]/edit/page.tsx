import { notFound, redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import BackButton from '@/components/shared/back-button';
import EditPollForm from '@/components/polls/edit-poll-form';
import { createServerSupabaseClient } from '@/lib/supabase-server';

// Force dynamic rendering to ensure fresh data and proper authorization checks
// This prevents stale poll data and ensures real-time ownership verification
export const dynamic = 'force-dynamic';

/**
 * Type definition for poll option data in edit context
 * 
 * Represents poll options with voting data for the edit interface,
 * including vote counts to inform editing decisions.
 * 
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
 * Complete poll data structure for editing interface
 * 
 * Contains all poll information needed for the edit form,
 * including metadata and voting statistics.
 * 
 * @interface PollDetail
 */
type PollDetail = {
  /** Unique identifier for the poll */
  id: string;
  /** Poll title/question */
  title: string;
  /** Optional poll description */
  description: string;
  /** User ID of the poll creator for ownership verification */
  created_by: string;
  /** Formatted creation date string for display */
  created_at: string;
  /** Array of poll options with current vote counts */
  options: PollOption[];
  /** Total number of votes across all options */
  totalVotes: number;
};

/**
 * Fetches detailed poll information for editing interface
 * 
 * Retrieves poll data with options and vote counts specifically for
 * the edit form. Includes ownership information for authorization.
 * 
 * Features:
 * - Fetches poll with related options and vote data
 * - Calculates total vote counts for editing context
 * - Formats data for edit form consumption
 * - Handles missing or inaccessible polls gracefully
 * 
 * @async
 * @function getPollDetails
 * @param {string} pollId - Unique identifier of the poll to fetch
 * @returns {Promise<PollDetail | null>} Poll details or null if not found
 * 
 * @throws {Error} When database query fails
 * 
 * @security
 * - Uses server-side Supabase client with RLS policies
 * - Returns creator information for ownership verification
 * - Handles unauthorized access gracefully
 * 
 * @example
 * ```typescript
 * const poll = await getPollDetails('poll-123');
 * if (poll && poll.created_by === currentUserId) {
 *   // Allow editing
 * }
 * ```
 */
async function getPollDetails(pollId: string): Promise<PollDetail | null> {
  try {
    // Use server-side Supabase client for RLS policy enforcement
    const supabase = createServerSupabaseClient();
    
    // Fetch poll with nested options for comprehensive edit data
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

    // Transform options data with vote count fallbacks
    // Ensures consistent data structure for edit form
    const options = poll.poll_options?.map((option: any) => ({
      id: option.id,
      text: option.text,
      votes: option.votes || 0, // Fallback for null vote counts
    })) || [];

    // Calculate total votes for editing context
    // Helps inform editing decisions (e.g., warning about vote loss)
    const totalVotes = options.reduce((sum, option) => sum + option.votes, 0);

    // Return formatted data for edit form consumption
    return {
      id: poll.id,
      title: poll.title,
      description: poll.description || '', // Handle null descriptions
      created_by: poll.created_by, // Critical for ownership verification
      created_at: new Date(poll.created_at).toLocaleDateString(),
      options,
      totalVotes,
    };
  } catch (error) {
    // Log errors for debugging but don't expose sensitive information
    console.error('Error fetching poll details:', error);
    return null;
  }
}

/**
 * Edit Poll Page Component
 * 
 * Secure poll editing interface that enforces ownership-based authorization.
 * Only allows poll creators to edit their own polls with proper security checks.
 * 
 * Features:
 * - Server-side ownership verification
 * - Automatic redirection for unauthorized access
 * - 404 handling for non-existent polls
 * - Warning about potential impact on existing votes
 * - Responsive design with centered layout
 * 
 * Security:
 * - Validates user authentication before allowing access
 * - Enforces poll ownership through database comparison
 * - Uses server-side rendering for secure data fetching
 * - Redirects unauthorized users to prevent data exposure
 * 
 * @async
 * @component EditPollPage
 * @param {Object} props - Component props
 * @param {Promise<{id: string}>} props.params - Next.js dynamic route parameters
 * @returns {Promise<JSX.Element>} Edit poll interface or redirects
 * 
 * @throws {notFound} When poll doesn't exist or is inaccessible
 * @throws {redirect} When user is not authenticated or not the poll owner
 * 
 * @example
 * Route: /polls/[id]/edit
 * URL: /polls/abc123/edit
 * Access: Only poll creator with valid authentication
 */
export default async function EditPollPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Extract poll ID from Next.js dynamic route parameters
  // Params is a Promise in Next.js App Router for async handling
  const { id } = await params;
  
  // Fetch poll details for editing (includes ownership info)
  const poll = await getPollDetails(id);

  // Handle non-existent or inaccessible polls
  // Triggers Next.js 404 page for better UX
  if (!poll) {
    notFound();
  }

  // Get current user for ownership verification
  // Uses server-side Supabase client for secure auth check
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Enforce ownership-based authorization
  // Redirects unauthorized users to prevent data exposure
  if (!user || poll.created_by !== user.id) {
    redirect('/polls');
  }

  return (
      <div className="container mx-auto px-4 py-8">
        {/* Navigation back to polls list */}
        <BackButton />
      
      {/* Main edit interface card */}
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Edit Poll</CardTitle>
          {/* Warning about potential impact on existing votes */}
          <CardDescription>
            Make changes to your poll. Note that editing may affect existing votes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Edit form with pre-populated poll data */}
          <EditPollForm poll={poll} />
        </CardContent>
      </Card>
    </div>
  );
}
