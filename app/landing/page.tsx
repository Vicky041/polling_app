import { HeroSection, FeaturesSection, TestimonialsSection, CTASection } from './components';
import './landing.css';

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      <CTASection />
    </div>
  );
}