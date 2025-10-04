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
      throw new Error("Failed to create post");
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
      throw new Error("Failed to update post");
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
    const response = await fetch(`${POST_SERVICE_URL}/author/${authorId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user posts");
    }

    return response.json();
  }
}

export const postService = new PostService();
