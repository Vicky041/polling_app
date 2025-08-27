'use client';

import { useAuth } from '../context/auth-context';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Profile() {
  const { user, signOut, loading } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsSigningOut(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 mx-4 sm:mx-auto bg-white rounded-lg shadow-md">
        <p className="text-center">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 mx-4 sm:mx-auto bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Profile</h1>
        <p className="text-center mb-6">You need to sign in to view your profile.</p>
        <div className="flex flex-col space-y-4">
          <button
            onClick={() => router.push('/auth/sign-in')}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md"
          >
            Sign In
          </button>
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

  return (
    <div className="max-w-md mx-auto mt-10 p-6 mx-4 sm:mx-auto bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Your Profile</h1>
      
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="mb-4">
          <p className="text-sm text-gray-500">Name</p>
          <p className="font-medium">{user.name || 'Not provided'}</p>
        </div>
        
        <div className="mb-4">
          <p className="text-sm text-gray-500">Email</p>
          <p className="font-medium">{user.email}</p>
        </div>
        
        <div className="mb-4">
          <p className="text-sm text-gray-500">User ID</p>
          <p className="font-medium text-xs truncate">{user.id}</p>
        </div>
      </div>
      
      <div className="flex justify-between">
        <button
          onClick={() => router.push('/polls/my-polls')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          My Polls
        </button>
        
        <button
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSigningOut ? 'Signing out...' : 'Sign Out'}
        </button>
      </div>
    </div>
  );
}