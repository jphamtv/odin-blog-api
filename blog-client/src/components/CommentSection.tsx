import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Comment, CreateCommentInput, UpdateCommentInput } from '../../../shared/types/commentTypes'
import { User } from '../../../shared/types/authTypes'
import { apiClient } from '../../../shared/utils/apiClient'
import { Button } from '../../../shared/components/ui'

interface CommentSectionProps {
  postId: string
  comments: Comment[]
}

export default function CommentSection({ postId, comments: initialComments }: CommentSectionProps) {
  const [comments, setComments] = useState(initialComments)
  const [newComment, setNewComment] = useState('')
  const [editingComment, setEditingComment] = useState<Comment | null>(null)
  const [error, setError] = useState('')
  const location = useLocation()
  
  const token = apiClient.getToken()
  const isLoggedIn = !!token
  const currentUser: User | null = token ? JSON.parse(atob(token.split('.')[1])) : null;
  const isAdmin = currentUser?.isAdmin || false;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const input: CreateCommentInput = {
        text: newComment,
        postId
      }
      const comment = await apiClient.post<Comment>(`/posts/${postId}/comments`, input)
      setComments(prev => [...prev, comment])
      setNewComment('')
    } catch (err) {
      setError('Failed to post comment')
    }
  }

  const handleEdit = async (comment: Comment) => {
    if (!editingComment) {
      setEditingComment(comment)
      return
    }

    try {
      const input: UpdateCommentInput = {
        text: editingComment.text
      }
      const updatedComment = await apiClient.put<Comment>(`/comments/${comment.id}`, input)
      setComments(prev => prev.map(c => c.id === comment.id ? updatedComment : c))
      setEditingComment(null)
    } catch (err) {
      setError('Failed to update comment')
    }
  }

  const handleDelete = async (commentId: string) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return

    try {
      await apiClient.delete(`/comments/${commentId}`)
      setComments(prev => prev.filter(c => c.id !== commentId))
    } catch (err) {
      setError('Failed to delete comment')
    }
  }

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Comments</h2>
      
      {isLoggedIn ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <textarea
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            className="w-full p-2 border rounded"
            rows={3}
            placeholder="Add a comment..."
          />
          {error && <p className="text-red-500 mt-2">{error}</p>}
          <Button type="submit" disabled={!newComment.trim()}>
            Post Comment
          </Button>
        </form>
      ) : (
        <div className="mb-8 p-4 bg-gray-50 rounded text-center">
          <p className="text-gray-600 mb-4">
            Want to join the discussion? Please log in or create an account.
          </p>
          <div className="space-x-4">
            <Link
              to="/login"
              state={{ from: location.pathname }}
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Log In
            </Link>
            <Link
              to="/register"
              state={{ from: location.pathname }}
              className="inline-block px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Create Account
            </Link>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {comments.map(comment => (
          <div key={comment.id} className="border-b pb-4">
            {editingComment?.id === comment.id ? (
              <div>
                <textarea
                  value={editingComment.text}
                  onChange={e => setEditingComment({...editingComment, text: e.target.value})}
                  className="w-full p-2 border rounded mb-2"
                  rows={3}
                />
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleEdit(comment)}
                    disabled={!editingComment.text.trim()}
                  >
                    Save
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setEditingComment(null)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <p className="mb-2">{comment.text}</p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <div>
                    <span>{comment.user.username}</span>
                    <span className="mx-2">•</span>
                    <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex gap-2">
                    {currentUser?.id === comment.userId && (
                      <button
                        onClick={() => handleEdit(comment)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </button>
                    )}
                    {(isAdmin || currentUser?.id === comment.userId) && (
                      <button
                        onClick={() => handleDelete(comment.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}