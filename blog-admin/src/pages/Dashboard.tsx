import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../../../shared/types/postTypes';
import { apiClient } from '../../../shared/utils/apiClient';
import { formatDate } from '../../../shared/utils/dateUtils';
import { Button } from '../../../shared/components/ui';

export function Dashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const response = await apiClient.get<{ posts: Post[] }>('/posts');
      setPosts(response.posts);
    } catch (err) {
      setError('Failed to load posts');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePublish = async (post: Post) => {
    try {
      await apiClient.put(`/posts/${post.id}`, {
        isPublished: !post.isPublished
      });
      loadPosts(); // Reload the posts list
    } catch (err) {
      setError('Failed to update post');
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Posts</h1>
        <Link to="/posts/new">
          <Button>New Post</Button>
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {posts.map((post) => (
            <li key={post.id}>
              <div className="px-4 py-4 flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-medium">{post.title}</h2>
                  <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                    <span>{formatDate(post.createdAt)}</span>
                    <span>•</span>
                    <span>{post.isPublished ? 'Published' : 'Draft'}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={() => togglePublish(post)}
                  >
                    {post.isPublished ? 'Unpublish' : 'Publish'}
                  </Button>
                  <Link to={`/posts/${post.id}/edit`}>
                    <Button variant="primary" size="small">
                      Edit
                    </Button>
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}