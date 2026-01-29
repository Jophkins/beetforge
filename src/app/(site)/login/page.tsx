"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import PublicHeader from "@/src/components/public-header/public-header";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Login failed");
        return;
      }

      router.push("/app");
    }
    catch {
      setError("Something went wrong. Please try again.");
    }
    finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <PublicHeader />

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-sm space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              Welcome back
            </h1>
            <p className="text-sm text-muted-foreground">
              Sign in to continue leveling up your skills
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?
            {" "}
            <Link href="/register" className="text-foreground underline underline-offset-4 hover:text-primary">
              Create one
            </Link>
          </div>

          {/* Branding */}
          <div className="pt-8 text-center">
            <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
              <span className="font-medium">S</span>
              <span className="text-muted-foreground/50">A</span>
              <span className="text-muted-foreground/50">B</span>
              <span className="text-muted-foreground/50">C</span>
              <span className="text-muted-foreground/50">D</span>
              <span className="text-muted-foreground/50">E</span>
              <span className="mx-2">—</span>
              <span>Level up your life</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
