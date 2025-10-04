"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { postService, Post } from "@/lib/post-service";
import { commentService, Comment } from "@/lib/comment-service";
import { useAuth } from "@/contexts/auth-context";
import { authService } from "@/lib/auth-service";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";

export default function SinglePostPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commentContent, setCommentContent] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentError, setCommentError] = useState<string | null>(null);

  const postId = params.id ? parseInt(params.id as string) : null;

  useEffect(() => {
    const fetchPostAndComments = async () => {
      if (!postId) {
        setError("Invalid post ID");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Fetch post and comments in parallel
        const [postData, commentsData] = await Promise.all([
          postService.getPostById(postId),
          commentService.getCommentsByPostId(postId),
        ]);
        setPost(postData);
        setComments(commentsData);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load post data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPostAndComments();
  }, [postId]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!commentContent.trim()) {
      setCommentError("Comment cannot be empty");
      return;
    }

    if (!postId) {
      setCommentError("Invalid post ID");
      return;
    }

    try {
      setSubmittingComment(true);
      setCommentError(null);
      const token = authService.getToken();

      if (!token) {
        router.push("/login");
        return;
      }

      const newComment = await commentService.createComment(
        {
          postId,
          content: commentContent,
        },
        token
      );

      // Add the new comment to the list
      setComments([...comments, newComment]);
      setCommentContent("");
    } catch (err) {
      setCommentError(
        err instanceof Error ? err.message : "Failed to post comment"
      );
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading post...</div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">
          Error: {error || "Post not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Post Content */}
      <article className="mb-12">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

        <div className="flex items-center gap-2 text-gray-600 mb-8">
          <span>By Author {post.authorId}</span>
          <span>•</span>
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        </div>

        <div
          className="post-content text-lg leading-relaxed"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>

      {/* Comments Section */}
      <section className="border-t pt-8">
        <h2 className="text-2xl font-bold mb-6">
          Comments ({comments.length})
        </h2>

        {/* Comment Form for Authenticated Users */}
        {isAuthenticated ? (
          <Card className="mb-8">
            <CardHeader>
              <CardDescription>Add a comment</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitComment} className="space-y-4">
                <Textarea
                  placeholder="Write your comment here..."
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  rows={4}
                  disabled={submittingComment}
                />
                {commentError && (
                  <p className="text-red-500 text-sm">{commentError}</p>
                )}
                <Button type="submit" disabled={submittingComment}>
                  {submittingComment ? "Posting..." : "Post Comment"}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-8 bg-gray-50">
            <CardContent className="pt-6">
              <p className="text-gray-600">
                Please{" "}
                <a href="/login" className="text-blue-600 hover:underline">
                  log in
                </a>{" "}
                to add a comment.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Comments List */}
        {comments.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No comments yet. Be the first to comment!
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <Card key={comment.id}>
                <CardHeader>
                  <CardDescription>
                    User {comment.userId} •{" "}
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap">{comment.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
