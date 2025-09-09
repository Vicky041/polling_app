import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Hero Section Component
const HeroSection = () => {
  return (
    <section className="flex flex-col md:flex-row items-center gap-8 py-12">
      <div className="flex-1 space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Create and Share Polls with <span className="text-primary">ALX Polly</span>
        </h1>
        <p className="text-xl text-muted-foreground">
          A simple, fast, and beautiful way to create polls and gather opinions from your audience.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Link href="/polls">
            <Button size="lg">Browse Polls</Button>
          </Link>
          <Link href="/auth/sign-up">
            <Button variant="outline" size="lg">Create Account</Button>
          </Link>
        </div>
      </div>
      <div className="flex-1 flex justify-center">
        <Image
          src="/globe.svg"
          alt="Polling Illustration"
          width={400}
          height={400}
          className="object-contain"
          priority
        />
      </div>
    </section>
  );
};

// Feature Card Component
interface FeatureCardProps {
  icon: string;
  iconAlt: string;
  title: string;
  description: string;
  content: string;
}

const FeatureCard = ({ icon, iconAlt, title, description, content }: FeatureCardProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="mb-2 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Image src={icon} alt={iconAlt} width={24} height={24} />
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{content}</p>
      </CardContent>
    </Card>
  );
};

// Features Section Component
const FeaturesSection = () => {
  const features = [
    {
      icon: "/file.svg",
      iconAlt: "Create",
      title: "Create Polls",
      description: "Create custom polls with multiple options in seconds",
      content: "Design polls with unlimited options and customize settings to fit your needs."
    },
    {
      icon: "/window.svg",
      iconAlt: "Share",
      title: "Share Easily",
      description: "Share your polls with anyone through a simple link",
      content: "Generate shareable links to distribute your polls across social media, email, or messaging apps."
    },
    {
      icon: "/file.svg",
      iconAlt: "Results",
      title: "Real-time Results",
      description: "Watch results update in real-time as votes come in",
      content: "See live updates as participants cast their votes, with beautiful visualizations of the results."
    }
  ];

  return (
    <section className="py-16">
      <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={feature.icon}
            iconAlt={feature.iconAlt}
            title={feature.title}
            description={feature.description}
            content={feature.content}
          />
        ))}
      </div>
    </section>
  );
};

// CTA Section Component
const CTASection = () => {
  return (
    <section className="py-16 text-center">
      <div className="max-w-3xl mx-auto space-y-6">
        <h2 className="text-3xl font-bold">Ready to create your first poll?</h2>
        <p className="text-xl text-muted-foreground">
          Join thousands of users who are already gathering insights with ALX Polly.
        </p>
        <div className="pt-4">
          <Link href="/auth/sign-up">
            <Button size="lg">Get Started for Free</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

// Main Landing Page Component
export default function LandingPage() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-6xl">
      <HeroSection />
      <FeaturesSection />
      <CTASection />
    </div>
  );
}