import Link from "next/link";

import PublicHeader from "@/src/components/public-header/public-header";
import { Button } from "@/src/components/ui/button";

export default function LandingPage() {
  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <PublicHeader />

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 overflow-y-auto">
        <div className="max-w-4xl w-full text-center space-y-4">
          <div className="inline-block px-3 py-1 text-xs font-medium bg-muted rounded-full">
            In Development
          </div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Level Up Your Skills
          </h1>

          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            BeetForge is a gamified personal skills tracker.
            Set goals, complete tasks, earn experience, and rank up your abilities.
          </p>

          <div className="flex gap-4 justify-center pt-2">
            <Link href="/app">
              <Button size="lg" className="px-6">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Features preview */}
          <div className="grid grid-cols-3 gap-4 pt-8 text-left">
            <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
              <div className="text-2xl font-bold mb-2 text-primary">S</div>
              <h3 className="font-semibold mb-1 text-sm">Rank System</h3>
              <p className="text-xs text-muted-foreground">
                From E to S — develop your skills and reach new levels
              </p>
            </div>

            <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
              <div className="text-2xl font-bold mb-2 text-primary">XP</div>
              <h3 className="font-semibold mb-1 text-sm">Experience</h3>
              <p className="text-xs text-muted-foreground">
                Complete tasks, earn XP, and track your progress
              </p>
            </div>

            <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
              <div className="text-2xl font-bold mb-2 text-primary">✓</div>
              <h3 className="font-semibold mb-1 text-sm">Goals & Tasks</h3>
              <p className="text-xs text-muted-foreground">
                Break down skills into goals and mark them complete
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-3 shrink-0">
        <div className="container mx-auto px-4 text-center text-xs text-muted-foreground">
          BeetForge © 2026
        </div>
      </footer>
    </div>
  );
}
