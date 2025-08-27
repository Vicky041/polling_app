'use client';

import Link from 'next/link';
import { useAuth } from '@/app/auth/context/auth-context';
import { Avatar } from '@/components/ui/avatar';

export function AppNavbar() {
  const { user, loading } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link href="/polls" className="text-xl font-bold text-blue-600 hover:text-blue-800">
            ALX Polly
          </Link>
          <nav className="hidden md:flex space-x-4">
            <Link href="/polls" className="text-gray-600 hover:text-blue-600">
              Polls
            </Link>
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
                href="/polls/create" 
                className="hidden md:block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 mr-4"
              >
                Create Poll
              </Link>
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