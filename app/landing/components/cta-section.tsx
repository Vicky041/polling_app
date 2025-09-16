'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { useIntersectionObserver } from '../hooks/use-intersection-observer';

const benefits = [
  "No credit card required",
  "Free 14-day trial",
  "Cancel anytime",
  "24/7 support"
];

export function CTASection() {
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <section ref={ref} className="py-24 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          animate={isIntersecting ? "visible" : "hidden"}
        >
          {/* Main CTA */}
          <motion.div className="mb-16" variants={itemVariants}>
            <motion.h2 
              className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight"
              variants={itemVariants}
            >
              Ready to Create Your
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent block">
                First Poll?
              </span>
            </motion.h2>
            <motion.p 
              className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto"
              variants={itemVariants}
            >
              Join thousands of users who trust our platform for their polling needs. 
              Start creating engaging polls in minutes, not hours.
            </motion.p>
          </motion.div>

          {/* Benefits */}
          <motion.div 
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
            variants={itemVariants}
          >
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-2 text-white/90">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-sm font-medium">{benefit}</span>
              </div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            variants={itemVariants}
          >
            <Link href="/polls/create">
              <Button 
                size="lg" 
                className="bg-white text-blue-900 hover:bg-blue-50 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                Start Creating Now
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/polls">
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300"
              >
                View Examples
              </Button>
            </Link>
          </motion.div>

          {/* Social Proof */}
          <motion.div 
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-8"
            variants={itemVariants}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">10,000+</div>
                <div className="text-blue-200 text-sm">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">1M+</div>
                <div className="text-blue-200 text-sm">Polls Created</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">99.9%</div>
                <div className="text-blue-200 text-sm">Uptime</div>
              </div>
            </div>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div 
            className="mt-12 text-center"
            variants={itemVariants}
          >
            <p className="text-blue-200 text-sm mb-4">Trusted by leading organizations worldwide</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              {/* Placeholder for company logos */}
              <div className="bg-white/20 rounded-lg px-6 py-3 text-white font-semibold">Company A</div>
              <div className="bg-white/20 rounded-lg px-6 py-3 text-white font-semibold">Company B</div>
              <div className="bg-white/20 rounded-lg px-6 py-3 text-white font-semibold">Company C</div>
              <div className="bg-white/20 rounded-lg px-6 py-3 text-white font-semibold">Company D</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}