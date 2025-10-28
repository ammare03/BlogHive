// API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081";
const COMMENT_SERVICE_URL = `${API_BASE_URL}/comments`;

export interface Comment {
  id: number;
  postId: number;
  userId: number;
  content: string;
  createdAt: string;
}

export interface CreateCommentRequest {
  postId: number;
  content: string;
}

class CommentService {
  async getCommentsByPostId(postId: number): Promise<Comment[]> {
    const response = await fetch(`${COMMENT_SERVICE_URL}/post/${postId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch comments");
    }

    return response.json();
  }

  async createComment(
    commentData: CreateCommentRequest,
    token: string
  ): Promise<Comment> {
    const response = await fetch(COMMENT_SERVICE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(commentData),
    });

    if (!response.ok) {
      throw new Error("Failed to create comment");
    }

    return response.json();
  }

  async deleteComment(id: number, token: string): Promise<void> {
    const response = await fetch(`${COMMENT_SERVICE_URL}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete comment");
    }
  }
}

export const commentService = new CommentService();
