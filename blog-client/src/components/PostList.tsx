import { Link } from 'react-router-dom'
import { Post } from '../../../shared/types/postTypes'
import { formatDate } from '../../../shared/utils/dateUtils'

interface PostListProps {
  posts: Post[]
}

export default function PostList({ posts }: PostListProps) {
  return (
    <div className="space-y-6">
      {posts.map(post => (
        <article key={post.id} className="border p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
          <p className="text-gray-600 mb-4">
            {post.text.substring(0, 150)}...
          </p>
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>By {post.author.username}</span>
            <span>{formatDate(post.createdAt)}</span>
          </div>
          <Link
            to={`/posts/${post.id}`}
            className="mt-4 inline-block text-blue-600 hover:text-blue-800"
          >
            Read more →
          </Link>
        </article>
      ))}
    </div>
  )
}