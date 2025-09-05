'use client';

import { useAuth } from '../context/auth-context';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

/**
 * User profile page component
 * 
 * This Client Component provides a comprehensive user profile interface
 * with authentication state management and user account actions.
 * 
 * Features:
 * - Displays user information (name, email, ID)
 * - Handles multiple authentication states (loading, signed in, signed out)
 * - Provides navigation to user-specific content (My Polls)
 * - Secure sign-out functionality with loading states
 * - Responsive design for mobile and desktop
 * 
 * Authentication States:
 * - Loading: Shows loading indicator while auth state is determined
 * - Unauthenticated: Shows sign-in/sign-up options
 * - Authenticated: Shows full profile with user data and actions
 * 
 * Security:
 * - Uses client-side auth context for real-time state updates
 * - Handles sign-out errors gracefully
 * - Prevents multiple simultaneous sign-out attempts
 * 
 * @returns JSX element representing the user profile interface
 */
export default function Profile() {
  // Get authentication state and actions from context
  // This provides real-time updates when auth state changes
  const { user, signOut, loading } = useAuth();
  
  // Local state to prevent multiple sign-out attempts
  // Provides visual feedback during the sign-out process
  const [isSigningOut, setIsSigningOut] = useState(false);
  
  // Router for programmatic navigation
  const router = useRouter();

  /**
   * Handles user sign-out with proper error handling and loading states
   * 
   * This function manages the sign-out process, providing visual feedback
   * and preventing multiple simultaneous sign-out attempts.
   * 
   * Features:
   * - Sets loading state to disable button and show feedback
   * - Calls auth context sign-out method
   * - Handles and logs any sign-out errors
   * - Always resets loading state in finally block
   */
  const handleSignOut = async () => {
    // Prevent multiple sign-out attempts and show loading state
    setIsSigningOut(true);
    try {
      // Call auth context sign-out method
      // This will clear user session and redirect appropriately
      await signOut();
    } catch (error) {
      // Log errors for debugging but don't expose to user
      // Sign-out errors are rare and usually indicate network issues
      console.error('Error signing out:', error);
    } finally {
      // Always reset loading state, even if sign-out fails
      // This ensures UI doesn't get stuck in loading state
      setIsSigningOut(false);
    }
  };

  // Loading state: Show while determining authentication status
  // This prevents flash of unauthenticated content
  if (loading) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 mx-4 sm:mx-auto bg-white rounded-lg shadow-md">
        <p className="text-center">Loading profile...</p>
      </div>
    );
  }

  // Unauthenticated state: Show sign-in/sign-up options
  // Provides clear path for users to access their profile
  if (!user) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 mx-4 sm:mx-auto bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Profile</h1>
        <p className="text-center mb-6">You need to sign in to view your profile.</p>
        <div className="flex flex-col space-y-4">
          {/* Primary action - sign in for existing users */}
          <button
            onClick={() => router.push('/auth/sign-in')}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md"
          >
            Sign In
          </button>
          {/* Secondary action - sign up for new users */}
          <button
            onClick={() => router.push('/auth/sign-up')}
            className="w-full py-2 px-4 bg-white hover:bg-gray-100 text-blue-600 font-medium rounded-md border border-blue-600"
          >
            Sign Up
          </button>
        </div>
      </div>
    );
  }

  // Authenticated state: Show full profile with user data and actions
  // This is the main profile interface for signed-in users
  return (
    <div className="max-w-md mx-auto mt-10 p-6 mx-4 sm:mx-auto bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Your Profile</h1>
      
      {/* User information display section */}
      {/* Gray background helps distinguish user data from actions */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="mb-4">
          <p className="text-sm text-gray-500">Name</p>
          {/* Handle cases where name might not be provided */}
          <p className="font-medium">{user.name || 'Not provided'}</p>
        </div>
        
        <div className="mb-4">
          <p className="text-sm text-gray-500">Email</p>
          {/* Email is always available from auth provider */}
          <p className="font-medium">{user.email}</p>
        </div>
        
        <div className="mb-4">
          <p className="text-sm text-gray-500">User ID</p>
          {/* Truncate long user IDs to prevent layout issues */}
          <p className="font-medium text-xs truncate">{user.id}</p>
        </div>
      </div>
      
      {/* Action buttons section */}
      {/* Flex layout with space-between for balanced appearance */}
      <div className="flex justify-between">
        {/* Navigation to user's polls - primary user action */}
        <button
          onClick={() => router.push('/polls/my-polls')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          My Polls
        </button>
        
        {/* Sign out button - destructive action with red styling */}
        {/* Disabled state prevents multiple sign-out attempts */}
        <button
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {/* Dynamic text provides feedback during sign-out process */}
          {isSigningOut ? 'Signing out...' : 'Sign Out'}
        </button>
      </div>
    </div>
  );
}