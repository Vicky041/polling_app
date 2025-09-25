'use client';

import Link from 'next/link';
import { useAuth } from '@/app/auth/context/auth-context';
import { Avatar } from '@/components/ui/avatar';

/**
 * Main application navigation bar component
 * 
 * Provides the primary navigation interface for the application with user authentication
 * awareness, responsive design, and contextual menu options based on user state.
 * 
 * @component AppNavbar
 * @returns {JSX.Element} Responsive navigation header with authentication-aware content
 * 
 * @features
 * - Authentication-aware navigation (different content for logged in/out users)
 * - Responsive design with mobile-friendly layout
 * - User avatar with dropdown menu for authenticated users
 * - Quick access to create poll functionality
 * - Loading states during authentication checks
 * - Brand logo with navigation link
 * - Contextual navigation links based on user status
 * 
 * @authentication
 * - Integrates with AuthContext for user state management
 * - Shows different navigation options for authenticated vs anonymous users
 * - Displays user avatar and profile access when logged in
 * - Provides sign-in/sign-up links for unauthenticated users
 * 
 * @responsive
 * - Mobile-first design with hidden elements on small screens
 * - Responsive navigation menu that adapts to screen size
 * - Touch-friendly interactive elements
 * - Proper spacing and layout across devices
 * 
 * @accessibility
 * - Semantic header element with proper navigation structure
 * - Keyboard accessible navigation links
 * - Screen reader friendly avatar and menu elements
 * - Proper focus management for interactive elements
 * 
 * @example
 * ```tsx
 * // Used in layout components
 * <AppNavbar />
 * // Automatically adapts based on authentication state
 * ```
 * 
 * @styling
 * - Clean white background with subtle border
 * - Consistent spacing and typography
 * - Hover states for interactive elements
 * - Brand colors for primary actions
 * - Dropdown menu with proper z-index layering
 */
export function AppNavbar() {
  const { user, loading } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-xl font-bold text-blue-600 hover:text-blue-800">
            ALX Polly
          </Link>
          <nav className="hidden md:flex space-x-4">
            {user && (
              <Link href="/polls" className="text-gray-600 hover:text-blue-600">
                Polls
              </Link>
            )}
            <Link href="/landing" className="text-gray-600 hover:text-blue-600">
              About
            </Link>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          {loading ? (
            <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
          ) : user ? (
            <>
              <Link 
                href="/polls/create" 
                className="hidden md:block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Create Poll
              </Link>
              <div className="relative group">
                <Link href="/auth/profile">
                  <Avatar className="h-8 w-8 cursor-pointer">
                    <div className="flex h-full w-full items-center justify-center bg-blue-600 text-white">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  </Avatar>
                </Link>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                  <Link 
                    href="/auth/profile" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Profile
                  </Link>
                  <Link 
                    href="/polls/my-polls" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    My Polls
                  </Link>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link 
                href="/auth/sign-in" 
                className="text-gray-600 hover:text-blue-600"
              >
                Sign In
              </Link>
              <Link 
                href="/auth/sign-up" 
                className="hidden md:block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}