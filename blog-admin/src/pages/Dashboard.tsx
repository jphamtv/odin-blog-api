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
  const [deletePost, setDeletePost] = useState<Post | null>(null);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get<Post[]>('/posts/admin');
      setPosts(response || []);
    } catch (err) {
      console.error('Dashboard - Error details:', err);
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
      await loadPosts();
    } catch (err) {
      console.error('Error updating post:', err);
      setError('Failed to update post');
    }
  };

  const handleDelete = async () => {
    if (!deletePost) return;

    try {
      await apiClient.delete(`/posts/${deletePost.id}`);
      await loadPosts();
      setDeletePost(null); // Close the confirmation dialog
    } catch (err) {
      console.error('Error deleting post:', err);
      setError('Failed to delete post');
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Posts ({posts.length})</h1>
        <Link to="/posts/new">
          <Button>New Post</Button>
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {(!posts || posts.length === 0) ? (
          <div className="p-4 text-center text-gray-500">
            No posts yet. Create your first post!
          </div>
        ) : (
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
                    <Button
                      variant="danger"
                      size="small"
                      onClick={() => setDeletePost(post)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      {deletePost && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-medium mb-4">Delete Post</h3>
            <p className="text-gray-500 mb-6">
              Are you sure you want to delete "{deletePost.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <Button
                variant="secondary"
                onClick={() => setDeletePost(null)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleDelete}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}