'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
// TODO: Import the actual auth context when implemented
// import { useAuth } from '@/app/auth/context/auth-context';

type UserProfile = {
  id: string;
  name: string;
  email: string;
  createdPolls: number;
  votedPolls: number;
};

export default function Profile() {
  // TODO: Use the actual auth context
  // const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching profile data
    const fetchProfile = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock profile data
        setProfile({
          id: '1',
          name: 'Demo User',
          email: 'demo@example.com',
          createdPolls: 5,
          votedPolls: 12,
        });
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSignOut = async () => {
    try {
      // TODO: Implement actual sign out
      console.log('Signing out...');
      // await signOut();
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading profile...</div>;
  }

  if (!profile) {
    return <div className="flex justify-center items-center min-h-screen">User not found</div>;
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-16 w-16">
            <div className="flex h-full w-full items-center justify-center bg-primary text-xl text-primary-foreground">
              {profile.name.charAt(0)}
            </div>
          </Avatar>
          <div>
            <CardTitle>{profile.name}</CardTitle>
            <CardDescription>{profile.email}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="p-4 border rounded-lg">
              <h3 className="text-lg font-medium">Created Polls</h3>
              <p className="text-3xl font-bold">{profile.createdPolls}</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="text-lg font-medium">Voted Polls</h3>
              <p className="text-3xl font-bold">{profile.votedPolls}</p>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button variant="outline" onClick={handleSignOut}>Sign Out</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}