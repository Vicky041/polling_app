'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useIntersectionObserver } from '../hooks/use-intersection-observer';
import { FEATURES } from '../constants/data';
import { ANIMATION_VARIANTS } from '../constants/animation-variants';
import { AnimatedSection } from './ui/animated-section';

export function FeaturesSection() {
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true
  });

  return (
    <section ref={ref} className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          variants={ANIMATION_VARIANTS.container}
          initial="hidden"
          animate={isIntersecting ? "visible" : "hidden"}
        >
          <motion.h2 
            className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6"
            variants={ANIMATION_VARIANTS.item}
          >
            Powerful Features for
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
              Better Polling
            </span>
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            variants={ANIMATION_VARIANTS.item}
          >
            Everything you need to create, manage, and analyze polls with professional-grade tools and insights.
          </motion.p>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
          variants={ANIMATION_VARIANTS.container}
          initial="hidden"
          animate={isIntersecting ? "visible" : "hidden"}
        >
          {FEATURES.map((feature, index) => (
            <motion.div key={index} variants={ANIMATION_VARIANTS.item}>
              <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:scale-105 h-full">
                <CardHeader className="pb-4">
                   <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                     {feature.icon}
                   </div>
                   <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                     {feature.title}
                   </CardTitle>
                   <CardDescription className="text-gray-600 text-base">
                     {feature.description}
                   </CardDescription>
                 </CardHeader>
                 <CardContent>
                   <p className="text-gray-700 leading-relaxed">
                     {feature.details}
                   </p>
                 </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to get started?
            </h3>
            <p className="text-gray-600 mb-6">
              Join thousands of users who trust our platform for their polling needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/sign-up">
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg w-full sm:w-auto">
                  Start Free Trial
                </button>
              </Link>
              <Link href="/pricing">
                <button className="border-2 border-gray-300 hover:border-blue-500 text-gray-700 hover:text-blue-600 px-8 py-3 rounded-xl font-semibold transition-all duration-300 w-full sm:w-auto">
                  View Pricing
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}