import Link from "next/link";

import { Button } from "../ui/button";

export default function PublicHeader() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold">
          BeetForge
        </Link>
        <nav className="flex gap-4">
          <Link href="/login">
            <Button variant="outline" size="sm">Sign In</Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
