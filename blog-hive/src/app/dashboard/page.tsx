"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { postService, Post } from "@/lib/post-service";
import { authService } from "@/lib/auth-service";
import { getHtmlPreview } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlusCircle } from "lucide-react";

export default function DashboardPage() {
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    // Fetch user's posts
    const fetchUserPosts = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      // Check if user.id is undefined (old token without userId claim)
      if (!user.id) {
        setError(
          "Your session is outdated. Please log out and log back in to continue."
        );
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const token = authService.getToken();
        if (token) {
          console.log("Fetching posts for user ID:", user.id);
          const data = await postService.getPostsByAuthor(user.id, token);
          console.log("Fetched posts:", data);
          setPosts(data);
          setError(null);
        }
      } catch (err) {
        console.error("Error fetching user posts:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load your posts"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [isAuthenticated, user, router]);

  // Show loading while checking authentication
  if (!isAuthenticated || !user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          Welcome back, {user.username}!
        </h1>
        <p className="text-gray-600">
          Here&apos;s an overview of your blog posts and activity.
        </p>
      </div>

      {/* Create New Post Button */}
      <div className="mb-8">
        <Button asChild size="lg">
          <Link href="/posts/create">
            <PlusCircle className="mr-2" />
            Create New Post
          </Link>
        </Button>
      </div>

      {/* User's Posts Section */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Your Blog Posts</h2>

        {loading ? (
          <div className="text-center py-8">
            <div className="text-gray-500">Loading your posts...</div>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <div className="text-red-500 mb-4">Error: {error}</div>
            {error.includes("outdated") && (
              <Button
                variant="default"
                onClick={() => {
                  logout();
                  router.push("/login");
                }}
              >
                Log Out and Login Again
              </Button>
            )}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-500 mb-4">
              You haven&apos;t created any posts yet.
            </div>
            <Button asChild variant="outline">
              <Link href="/posts/create">
                <PlusCircle className="mr-2" />
                Create Your First Post
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Card key={post.id} className="h-full">
                <CardHeader>
                  <CardTitle>{post.title}</CardTitle>
                  <CardDescription>
                    Created on {new Date(post.createdAt).toLocaleDateString()}
                    {post.updatedAt !== post.createdAt && (
                      <span className="ml-2">
                        • Updated on{" "}
                        {new Date(post.updatedAt).toLocaleDateString()}
                      </span>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 line-clamp-3 mb-4">
                    {getHtmlPreview(post.content, 150)}
                  </p>
                  <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/posts/${post.id}`}>View</Link>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/posts/${post.id}/edit`}>Edit</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
