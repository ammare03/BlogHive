"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { postService, Post } from "@/lib/post-service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState("");
  const [post, setPost] = useState<Post | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  // Fetch post data
  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    const fetchPost = async () => {
      try {
        const postId = Number(params.id);
        if (isNaN(postId)) {
          throw new Error("Invalid post ID");
        }

        const fetchedPost = await postService.getPostById(postId);
        setPost(fetchedPost);
        setFormData({
          title: fetchedPost.title,
          content: fetchedPost.content,
        });

        // Check if user is the author
        if (user && fetchedPost.authorId !== user.id) {
          setError("You are not authorized to edit this post");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch post");
      } finally {
        setIsFetching(false);
      }
    };

    fetchPost();
  }, [params.id, user, isAuthenticated, router]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      title: e.target.value,
    }));
  };

  const handleContentChange = (content: string) => {
    setFormData((prev) => ({
      ...prev,
      content,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validate form
    if (!formData.title.trim() || !formData.content.trim()) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    // Check authorization
    if (!post || !user || post.authorId !== user.id) {
      setError("You are not authorized to edit this post");
      setIsLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No authentication token found. Please log in.");
      }

      await postService.updatePost(
        post.id,
        {
          title: formData.title.trim(),
          content: formData.content.trim(),
        },
        token
      );

      // Redirect to post detail page on success
      router.push(`/posts/${post.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update post");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-gray-600">Loading post...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error && !post) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardContent className="py-8">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
            <Button
              onClick={() => router.push("/posts")}
              className="mt-4"
              variant="outline"
            >
              Back to Posts
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Don't render form if user is not authorized
  if (post && user && post.authorId !== user.id) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardContent className="py-8">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              You are not authorized to edit this post
            </div>
            <Button
              onClick={() => router.push(`/posts/${post.id}`)}
              className="mt-4"
              variant="outline"
            >
              Back to Post
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Edit Post</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                type="text"
                placeholder="Enter post title"
                value={formData.title}
                onChange={handleTitleChange}
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <RichTextEditor
                content={formData.content}
                onChange={handleContentChange}
                placeholder="Write your post content here..."
                disabled={isLoading}
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
