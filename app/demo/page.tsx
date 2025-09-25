'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';

import Link from 'next/link';
import { ArrowLeft, Users, Clock, BarChart3, Share2 } from 'lucide-react';

interface DemoPollOption {
  id: string;
  text: string;
  votes: number;
  color: string;
}

export default function DemoPage() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  
  const demoOptions: DemoPollOption[] = [
    { id: '1', text: 'React', votes: 45, color: 'bg-blue-500' },
    { id: '2', text: 'Vue.js', votes: 28, color: 'bg-green-500' },
    { id: '3', text: 'Angular', votes: 18, color: 'bg-red-500' },
    { id: '4', text: 'Svelte', votes: 12, color: 'bg-orange-500' },
  ];

  const totalVotes = demoOptions.reduce((sum, option) => sum + option.votes, 0);

  const handleVote = () => {
    if (selectedOption && !hasVoted) {
      setHasVoted(true);
      // Simulate vote animation
    }
  };

  const getPercentage = (votes: number) => {
    return Math.round((votes / totalVotes) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link 
            href="/" 
            className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Interactive Poll Demo
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience how easy it is to create and participate in polls with our platform. 
            Try voting in this sample poll!
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Poll Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl text-gray-900">
                  What's your favorite frontend framework?
                </CardTitle>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{totalVotes} votes</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>Demo Poll</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {demoOptions.map((option) => (
                  <motion.div
                    key={option.id}
                    whileHover={{ scale: hasVoted ? 1 : 1.02 }}
                    whileTap={{ scale: hasVoted ? 1 : 0.98 }}
                    className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                      selectedOption === option.id && !hasVoted
                        ? 'border-blue-500 bg-blue-50'
                        : hasVoted
                        ? 'border-gray-200 cursor-default'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => !hasVoted && setSelectedOption(option.id)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">{option.text}</span>
                      {hasVoted && (
                        <span className="text-sm font-semibold text-gray-600">
                          {getPercentage(option.votes)}%
                        </span>
                      )}
                    </div>
                    
                    {hasVoted && (
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${getPercentage(option.votes)}%` }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className={`absolute bottom-0 left-0 h-1 ${option.color} rounded-b-lg`}
                      />
                    )}
                  </motion.div>
                ))}
                
                {!hasVoted && (
                  <Button
                    onClick={handleVote}
                    disabled={!selectedOption}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    Cast Your Vote
                  </Button>
                )}
                
                {hasVoted && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-center p-4 bg-green-50 rounded-lg border border-green-200"
                  >
                    <p className="text-green-700 font-medium">
                      Thanks for voting! 🎉
                    </p>
                    <p className="text-green-600 text-sm mt-1">
                      Your vote has been recorded.
                    </p>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Features Showcase */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  Real-time Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Watch votes come in live with beautiful animated charts and instant updates.
                </p>
                <div className="space-y-3">
                  {demoOptions.map((option) => (
                    <div key={option.id} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{option.text}</span>
                        <span>{option.votes} votes</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${option.color}`}
                          style={{ width: `${getPercentage(option.votes)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-purple-600" />
                  Easy Sharing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Share your polls instantly with custom links, QR codes, or social media integration.
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Copy Link</Button>
                  <Button variant="outline" size="sm">QR Code</Button>
                  <Button variant="outline" size="sm">Share</Button>
                </div>
              </CardContent>
            </Card>

            <div className="text-center pt-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Ready to create your own polls?
              </h3>
              <div className="space-y-3">
                <Link href="/auth/sign-up">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    Get Started Free
                  </Button>
                </Link>
                <Link href="/auth/sign-in">
                  <Button variant="outline" className="w-full">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}