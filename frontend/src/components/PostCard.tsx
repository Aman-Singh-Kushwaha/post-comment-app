import Link from 'next/link';
import { Post } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import RichTextRenderer from './RichTextRenderer';

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{post.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <RichTextRenderer content={post.content.substring(0, 200) + '...'} />
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          <p>By {post.author.username}</p>
          <p>{new Date(post.createdAt).toLocaleDateString()}</p>
        </div>
        <Link href={`/post/${post.id}`} className="text-blue-500 hover:underline">
          Read More
        </Link>
      </CardFooter>
    </Card>
  );
};

export default PostCard;
