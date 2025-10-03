"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Home, LogOut, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";

export function Navbar() {
  const router = useRouter();
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-foreground">
              BlogHive
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Home</span>
            </Link>
            
            <Link
              href="/posts"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Posts</span>
            </Link>

            {isAuthenticated ? (
              // Show logout button when user is authenticated
              <Button variant="ghost" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            ) : (
              // Show login and register buttons when user is not authenticated
              <>
                <Button variant="ghost" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link href="/register">Register</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
