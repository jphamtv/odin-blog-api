import { Post } from '../../../shared/types/postTypes'
import { formatDate } from '../../../shared/utils/dateUtils';

interface PostDetailProps {
  post: Post
}

export default function PostDetail({ post }: PostDetailProps) {
  return (
    <article className="prose max-w-none">
      <h1>{post.title}</h1>
      <div className="flex gap-4 text-sm text-gray-500 mb-8">
        <span>By {post.author.username}</span>
        <span>{formatDate(post.createdAt)}</span>
      </div>
      <div className="whitespace-pre-wrap">{post.text}</div>
    </article>
  )
}