import { useState, useEffect } from "react";
import { Post } from "../../../shared/types/postTypes";
import { apiClient } from "../../../shared/utils/apiClient";
import PostList from "../components/PostList";

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await apiClient.get<Post[]>("/posts/published");
        setPosts(data || []);
      } catch (err) {
        setError("Failed to load posts");
        console.error("Error loading posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Blog Posts</h1>
      <PostList posts={posts} />
    </main>
  );
}
