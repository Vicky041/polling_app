import { BarChart3, Users, Zap, Shield, Globe, TrendingUp } from "lucide-react";
import { Feature, Stat, PollOption } from '../types';

/**
 * Features data for the features section
 */
export const FEATURES: Feature[] = [
  {
    icon: <BarChart3 className="w-8 h-8" />,
    title: "Real-time Analytics",
    description: "Get instant insights as responses come in",
    details: "Track voting patterns, response rates, and demographic breakdowns with live updating charts and graphs.",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Collaborative Polling",
    description: "Work together with your team",
    details: "Share polls with team members, collaborate on questions, and manage permissions for different user roles.",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: "Lightning Fast",
    description: "Create polls in seconds, not minutes",
    details: "Our streamlined interface lets you build comprehensive polls quickly with templates and smart suggestions.",
    color: "from-yellow-500 to-orange-500"
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Secure & Private",
    description: "Your data is protected with enterprise-grade security",
    details: "End-to-end encryption, GDPR compliance, and advanced privacy controls keep your polls and data safe.",
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: <Globe className="w-8 h-8" />,
    title: "Global Reach",
    description: "Share polls worldwide with multi-language support",
    details: "Reach audiences globally with automatic translation, timezone handling, and cultural customization options.",
    color: "from-indigo-500 to-blue-500"
  },
  {
    icon: <TrendingUp className="w-8 h-8" />,
    title: "Advanced Insights",
    description: "Deep analytics and trend analysis",
    details: "AI-powered insights, predictive analytics, and comprehensive reporting to understand your audience better.",
    color: "from-red-500 to-pink-500"
  }
];

/**
 * Statistics data for the hero section
 */
export const HERO_STATS: Stat[] = [
  { value: "10K+", label: "Active Users" },
  { value: "50K+", label: "Polls Created" },
  { value: "1M+", label: "Responses" }
];

/**
 * Demo poll options for the hero section
 */
export const DEMO_POLL_OPTIONS: PollOption[] = [
  { label: "JavaScript", percentage: 45, color: "blue" },
  { label: "Python", percentage: 30, color: "purple" },
  { label: "TypeScript", percentage: 25, color: "green" }
];

/**
 * Demo poll metadata
 */
export const DEMO_POLL_META = {
  title: "What's your favorite programming language?",
  totalVotes: "1,234 votes",
  timeLeft: "2 days left"
} as const;