import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function LandingPage() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-6xl">
      {/* Hero Section */}
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

      {/* Features Section */}
      <section className="py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <div className="mb-2 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Image src="/file.svg" alt="Create" width={24} height={24} />
              </div>
              <CardTitle>Create Polls</CardTitle>
              <CardDescription>
                Create custom polls with multiple options in seconds
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Design polls with unlimited options and customize settings to fit your needs.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="mb-2 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Image src="/window.svg" alt="Share" width={24} height={24} />
              </div>
              <CardTitle>Share Easily</CardTitle>
              <CardDescription>
                Share your polls with anyone through a simple link
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Generate shareable links to distribute your polls across social media, email, or messaging apps.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="mb-2 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Image src="/file.svg" alt="Results" width={24} height={24} />
              </div>
              <CardTitle>Real-time Results</CardTitle>
              <CardDescription>
                Watch results update in real-time as votes come in
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>See live updates as participants cast their votes, with beautiful visualizations of the results.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
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
    </div>
  );
}