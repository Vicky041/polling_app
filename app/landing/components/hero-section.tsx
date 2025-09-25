'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Sparkles, Users, BarChart3, Zap, TrendingUp, Clock, Shield } from 'lucide-react';
import { useIntersectionObserver } from '../hooks/use-intersection-observer';
import { ANIMATION_VARIANTS } from '../constants/animation-variants';
import { HERO_STATS, DEMO_POLL_OPTIONS, DEMO_POLL_META } from '../constants/data';
import { PollOptionComponent } from './ui/poll-option';
import { FloatingElement } from './ui/floating-element';

export function HeroSection() {
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true
  });

  return (
    <section 
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      {/* Animated Background Blobs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      <div className="absolute top-40 right-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div 
            className="text-center lg:text-left"
            variants={ANIMATION_VARIANTS.container}
            initial="hidden"
            animate={isIntersecting ? "visible" : "hidden"}
          >
            <motion.div 
              className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6"
              variants={ANIMATION_VARIANTS.item}
            >
              <Sparkles className="w-4 h-4" />
              New: Real-time polling features
            </motion.div>

            <motion.h1 
              className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight"
              variants={ANIMATION_VARIANTS.item}
            >
              Create Amazing
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
                Polls & Surveys
              </span>
            </motion.h1>

            <motion.p 
              className="text-xl text-gray-600 mb-8 max-w-2xl"
              variants={ANIMATION_VARIANTS.item}
            >
              Build engaging polls, collect valuable insights, and make data-driven decisions. 
              Our platform makes it easy to create, share, and analyze polls in real-time.
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              variants={ANIMATION_VARIANTS.item}
            >
              <Link href="/auth/sign-up">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  Start Creating Polls
                  <Zap className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/demo">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-2 border-gray-300 hover:border-blue-500 text-gray-700 hover:text-blue-600 px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300"
                >
                  View Demo
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div 
              className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-gray-200"
              variants={ANIMATION_VARIANTS.item}
            >
              {HERO_STATS.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Content - Poll Preview */}
          <motion.div 
            className="relative"
            variants={ANIMATION_VARIANTS.container}
            initial="hidden"
            animate={isIntersecting ? "visible" : "hidden"}
          >
            <motion.div variants={ANIMATION_VARIANTS.item}>
              <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Live Poll Preview</h3>
                    <p className="text-sm text-gray-500">Real-time results</p>
                  </div>
                </div>
                
                <h4 className="text-lg font-semibold mb-4 text-gray-800">
                  {DEMO_POLL_META.title}
                </h4>
                
                <div className="space-y-3">
                  {DEMO_POLL_OPTIONS.map((option, index) => (
                    <PollOptionComponent key={index} option={option} />
                  ))}
                </div>
                
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Users className="w-4 h-4" />
                    <span>{DEMO_POLL_META.totalVotes}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>{DEMO_POLL_META.timeLeft}</span>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Floating Elements */}
            <FloatingElement 
              className="absolute -top-4 -right-4 bg-green-500 text-white p-3 rounded-full shadow-lg"
              duration={3}
            >
              <TrendingUp className="w-5 h-5" />
            </FloatingElement>

            <FloatingElement 
              className="absolute -bottom-4 -left-4 bg-blue-500 text-white p-3 rounded-full shadow-lg"
              reverse={true}
              duration={4}
              delay={1}
            >
              <Shield className="w-5 h-5" />
            </FloatingElement>
          </motion.div>
        </div>
      </div>
    </section>
  );
}