// API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
const POST_SERVICE_URL = `${API_BASE_URL}/posts`;

export interface Post {
  id: number;
  title: string;
  content: string;
  authorId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostRequest {
  title: string;
  content: string;
}

class PostService {
  async getAllPosts(): Promise<Post[]> {
    const response = await fetch(POST_SERVICE_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch posts");
    }

    return response.json();
  }

  async getPostById(id: number): Promise<Post> {
    const response = await fetch(`${POST_SERVICE_URL}/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch post");
    }

    return response.json();
  }

  async createPost(postData: CreatePostRequest, token: string): Promise<Post> {
    const response = await fetch(POST_SERVICE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      let errorMessage =
        errorData?.message ||
        errorData?.error ||
        `Failed to create post (${response.status})`;

      // Add helpful context for common status codes
      if (response.status === 403) {
        errorMessage = "Access denied. Please log out and log in again.";
      } else if (response.status === 401) {
        errorMessage = "Not authenticated. Please log in.";
      }

      throw new Error(errorMessage);
    }

    return response.json();
  }

  async updatePost(
    id: number,
    postData: CreatePostRequest,
    token: string
  ): Promise<Post> {
    const response = await fetch(`${POST_SERVICE_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      let errorMessage =
        errorData?.message ||
        errorData?.error ||
        `Failed to update post (${response.status})`;

      // Add helpful context for common status codes
      if (response.status === 403) {
        errorMessage =
          "Access denied. You may not have permission to edit this post.";
      } else if (response.status === 401) {
        errorMessage = "Not authenticated. Please log in.";
      }

      throw new Error(errorMessage);
    }

    return response.json();
  }

  async deletePost(id: number, token: string): Promise<void> {
    const response = await fetch(`${POST_SERVICE_URL}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete post");
    }
  }

  async getPostsByAuthor(authorId: number, token: string): Promise<Post[]> {
    console.log(
      `Fetching posts for author ${authorId} from: ${POST_SERVICE_URL}/author/${authorId}`
    );

    const response = await fetch(`${POST_SERVICE_URL}/author/${authorId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage =
        errorData?.message ||
        errorData?.error ||
        `Failed to fetch user posts (${response.status})`;
      console.error(
        "Failed to fetch user posts:",
        response.status,
        errorMessage
      );
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log(`Fetched ${data.length} posts for author ${authorId}`);
    return data;
  }
}

export const postService = new PostService();
