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
    <header className="flex items-center justify-between p-4 border-b">
      <h1 className="text-xl font-semibold">BeetForge</h1>
      <div className="flex gap-2 items-center">
        <button className="px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-100 transition-colors">
          Main
        </button>
        <button className="px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-100 transition-colors">
          Rewards
        </button>
        <button className="px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-100 transition-colors">
          Help
        </button>
        <div className="w-px h-6 bg-border mx-2" />
        <Button
          variant="outline"
          size="sm"
          onClick={handleSignOut}
          disabled={isLoading}
        >
          {isLoading ? "Signing out..." : "Sign Out"}
        </Button>
      </div>
    </header>
  );
}

export default Header;
