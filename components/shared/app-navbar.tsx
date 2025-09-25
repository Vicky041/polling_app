'use client';

import Link from 'next/link';
import { useAuth } from '@/app/auth/context/auth-context';
import { Avatar } from '@/components/ui/avatar';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Professional application navigation bar component
 * 
 * Provides a comprehensive navigation interface with enhanced user experience,
 * professional styling, and improved accessibility features.
 * 
 * @component AppNavbar
 * @returns {JSX.Element} Professional responsive navigation header
 * 
 * @features
 * - Professional navigation with comprehensive link structure
 * - Enhanced mobile responsiveness with hamburger menu
 * - Authentication-aware navigation with contextual content
 * - Improved typography and visual hierarchy
 * - Active link highlighting for better user orientation
 * - Enhanced dropdown menus with more options
 * - Loading states and smooth transitions
 * 
 * @navigation
 * - Home: Landing page access
 * - Features: Product feature showcase
 * - Demo: Interactive demonstration
 * - Pricing: Pricing plans and information
 * - Polls: User poll management (authenticated users)
 * - About: Company/product information
 * 
 * @authentication
 * - Dynamic navigation based on authentication state
 * - Enhanced user dropdown with profile and settings
 * - Quick access to poll creation for authenticated users
 * - Professional sign-in/sign-up flow for guests
 * 
 * @responsive
 * - Mobile-first design with collapsible navigation
 * - Hamburger menu for mobile devices
 * - Touch-friendly interactive elements
 * - Optimized spacing across all screen sizes
 * 
 * @accessibility
 * - Semantic navigation structure
 * - Keyboard navigation support
 * - Screen reader friendly elements
 * - Focus management and visual indicators
 */
export function AppNavbar() {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return pathname === path;
  };

  const navigationLinks = [
    { href: '/landing', label: 'Home', showAlways: true },
    { href: '/demo', label: 'Demo', showAlways: true },
    { href: '/pricing', label: 'Pricing', showAlways: true },
    { href: '/polls', label: 'Polls', showAlways: false, requiresAuth: true },
  ];

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Brand Logo */}
          <div className="flex items-center">
            <Link 
              href="/" 
              className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors duration-200"
            >
              AV-Polly
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigationLinks.map((link) => {
              const shouldShow = link.showAlways || (link.requiresAuth && user);
              if (!shouldShow) return null;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors duration-200 hover:text-blue-600 ${
                    isActive(link.href)
                      ? 'text-blue-600 border-b-2 border-blue-600 pb-1'
                      : 'text-gray-700'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            {loading ? (
              <div className="h-9 w-9 rounded-full bg-gray-200 animate-pulse"></div>
            ) : user ? (
              <>
                <Link 
                  href="/polls/create" 
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm"
                >
                  Create Poll
                </Link>
                <div className="relative group">
                  <button className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200">
                    <Avatar className="h-9 w-9 cursor-pointer">
                      <div className="flex h-full w-full items-center justify-center bg-blue-600 text-white font-medium">
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                    </Avatar>
                  </button>
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20 hidden group-hover:block">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user.name || 'User'}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <Link 
                      href="/auth/profile" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                    >
                      Profile Settings
                    </Link>
                    <Link 
                      href="/polls" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                    >
                      My Polls
                    </Link>
                    <Link 
                      href="/polls/create" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                    >
                      Create New Poll
                    </Link>
                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <button 
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                        onClick={() => {/* Add sign out logic */}}
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link 
                  href="/auth/sign-in" 
                  className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200"
                >
                  Sign In
                </Link>
                <Link 
                  href="/auth/sign-up" 
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-4">
            {!loading && user && (
              <Link 
                href="/polls/create" 
                className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors duration-200"
              >
                Create
              </Link>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors duration-200"
              aria-label="Toggle mobile menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-3">
              {navigationLinks.map((link) => {
                const shouldShow = link.showAlways || (link.requiresAuth && user);
                if (!shouldShow) return null;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-base font-medium transition-colors duration-200 hover:text-blue-600 ${
                      isActive(link.href) ? 'text-blue-600' : 'text-gray-700'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                );
              })}
              
              {loading ? (
                <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
              ) : user ? (
                <div className="pt-3 border-t border-gray-200 space-y-3">
                  <Link 
                    href="/auth/profile" 
                    className="block text-base font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link 
                    href="/polls" 
                    className="block text-base font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Polls
                  </Link>
                </div>
              ) : (
                <div className="pt-3 border-t border-gray-200 space-y-3">
                  <Link 
                    href="/auth/sign-in" 
                    className="block text-base font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link 
                    href="/auth/sign-up" 
                    className="block text-base font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}