"use client";

import Link from "next/link";
import { useState } from "react";

import PublicHeader from "@/src/components/public-header/public-header";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Client-side validation
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Registration failed");
        return;
      }

      setIsSuccess(true);
      setPassword("");
      setConfirmPassword("");
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
              Create an account
            </h1>
            <p className="text-sm text-muted-foreground">
              Start leveling up your skills today
            </p>
          </div>

          {/* Success message */}
          {isSuccess && (
            <div className="p-4 border border-primary/20 bg-primary/5 rounded-lg text-center space-y-3">
              <p className="text-sm font-medium">Account created successfully!</p>
              <p className="text-sm text-muted-foreground">
                You can now sign in with your credentials.
              </p>
              <Link href="/login">
                <Button className="w-full">Go to Sign In</Button>
              </Link>
            </div>
          )}

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
                disabled={isSuccess}
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
                autoComplete="new-password"
                disabled={isSuccess}
              />
              <p className="text-xs text-muted-foreground">
                Must be at least 8 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
                disabled={isSuccess}
              />
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <Button type="submit" className="w-full" disabled={isLoading || isSuccess}>
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </form>

          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground">
            Already have an account?
            {" "}
            <Link href="/login" className="text-foreground underline underline-offset-4 hover:text-primary">
              Sign in
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
