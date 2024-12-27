import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Post as PostType } from '../../../shared/types/postTypes'
import { apiClient } from '../../../shared/utils/apiClient'
import PostDetail from '../components/PostDetail'
import CommentSection from '../components/CommentSection'

export default function Post() {
  const { id } = useParams<{ id: string }>()
  const [post, setPost] = useState<PostType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await apiClient.get<PostType>(`/posts/published/${id}`)
        setPost(data)
      } catch (err) {
        setError('Failed to load post')
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchPost()
  }, [id])

  if (loading) return <div>Loading...</div>
  if (error) return <div>{error}</div>
  if (!post) return <div>Post not found</div>

  return (
    <main className="container mx-auto px-4 py-8">
      <PostDetail post={post} />
      <CommentSection postId={post.id} comments={post.comments || []} />
    </main>
  )
}