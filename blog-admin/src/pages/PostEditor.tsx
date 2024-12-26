import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Post } from '../../../shared/types/postTypes';
import { apiClient } from '../../../shared/utils/apiClient';
import { Button, Input, TextArea } from '../../../shared/components/ui';

export function PostEditor() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [post, setPost] = useState({
    title: '',
    text: '',
    isPublished: false
  });

  useEffect(() => {
    if (id) {
      loadPost();
    }
  }, [id]);

  const loadPost = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get<{ post: Post }>(`/posts/admin/${id}`);
      const { title, text, isPublished } = response.post;
      setPost({ title, text, isPublished });
    } catch (err) {
      console.error('Error loading post:', err);
      setError('Failed to load post');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting post:', post); // Debug log
    
    try {
      setIsLoading(true);
      if (id) {
        await apiClient.put(`/posts/${id}`, post);
      } else {
        await apiClient.post('/posts', post);
      }
      navigate('/posts');
    } catch (err) {
      console.error('Error saving post:', err);
      setError('Failed to save post');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    if (name === 'isPublished') {
      const checkbox = e.target as HTMLInputElement;
      console.log('Checkbox checked:', checkbox.checked); // Debug log
      setPost(prev => ({
        ...prev,
        isPublished: checkbox.checked
      }));
    } else {
      setPost(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  if (isLoading && id) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {id ? 'Edit Post' : 'Create New Post'}
        </h1>
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="isPublished"
              checked={post.isPublished}
              onChange={handleChange}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span>Published</span>
          </label>
          <Button type="submit" isLoading={isLoading}>
            {id ? 'Update' : 'Create'}
          </Button>
        </div>
      </div>

      {error && (
        <div className="text-red-600">{error}</div>
      )}

      <Input
        label="Title"
        name="title"
        value={post.title}
        onChange={handleChange}
        required
        placeholder="Enter post title"
      />

      <TextArea
        label="Content"
        name="text"
        value={post.text}
        onChange={handleChange}
        required
        rows={15}
        placeholder="Write your post content here..."
      />
    </form>
  );
}