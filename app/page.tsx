import { HeroSection, FeaturesSection, TestimonialsSection, CTASection } from './landing/components';
import './landing/landing.css';

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      <CTASection />
    </div>
  );
}
