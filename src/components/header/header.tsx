"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/src/components/ui/button";

function Header() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
    }
    catch {
      console.error("Failed to sign out");
    }
    finally {
      setIsLoading(false);
    }
  };

  return (
    <header className="flex flex-wrap items-center justify-between gap-2 p-3 sm:p-4 border-b">
      <h1 className="text-lg sm:text-xl font-semibold">BeetForge</h1>
      <div className="flex gap-1 sm:gap-2 items-center">
        <button
          type="button"
          className="px-2 sm:px-4 py-1.5 sm:py-2 text-sm font-medium rounded-md hover:bg-muted transition-colors"
        >
          Main
        </button>
        <button
          type="button"
          className="hidden sm:block px-4 py-2 text-sm font-medium rounded-md hover:bg-muted transition-colors"
        >
          Rewards
        </button>
        <button
          type="button"
          className="hidden sm:block px-4 py-2 text-sm font-medium rounded-md hover:bg-muted transition-colors"
        >
          Help
        </button>
        <div className="hidden sm:block w-px h-6 bg-border mx-2" />
        <Button
          variant="outline"
          size="sm"
          onClick={handleSignOut}
          disabled={isLoading}
        >
          {isLoading ? "..." : "Sign Out"}
        </Button>
      </div>
    </header>
  );
}

export default Header;
