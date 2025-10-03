import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

function Home() {
  // Sample blog post data
  const blogPosts = [
    {
      id: 1,
      title: 'Getting Started with React',
      description: 'Learn the fundamentals of React and start building amazing web applications.',
      author: 'John Doe',
      image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop'
    },
    {
      id: 2,
      title: 'Mastering Tailwind CSS',
      description: 'Discover how to create beautiful, responsive designs with Tailwind CSS utility classes.',
      author: 'Jane Smith',
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=250&fit=crop'
    },
    {
      id: 3,
      title: 'Building Microservices',
      description: 'A comprehensive guide to designing and implementing microservices architecture.',
      author: 'Mike Johnson',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=250&fit=crop'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Bar */}
      <nav className="fixed top-0 w-full bg-white shadow-md z-50 border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-primary">
            BlogHive
          </div>
          <div className="flex gap-6 items-center">
            <a href="/" className="text-foreground hover:text-primary transition-colors">
              Home
            </a>
            <a href="/login" className="text-foreground hover:text-primary transition-colors">
              Login
            </a>
            <a href="/register" className="text-foreground hover:text-primary transition-colors">
              Register
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Welcome to BlogHive
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover amazing stories, insights, and ideas from writers around the world. 
            Join our community and share your voice with the world.
          </p>
          <Button size="lg" className="text-lg px-8 py-6">
            Explore Posts
          </Button>
        </div>
      </section>

      {/* Blog Posts Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-10 text-center">
            Featured Posts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
                <CardHeader>
                  <CardTitle>{post.title}</CardTitle>
                  <CardDescription>By {post.author}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {post.description}
                  </p>
                  <Button variant="link" className="mt-4 px-0">
                    Read More →
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-8 px-4">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; 2025 BlogHive. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
