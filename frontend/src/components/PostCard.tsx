import Link from 'next/link';
import { Post } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import RichTextRenderer from './RichTextRenderer';

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  return (
    <Link href={`/post/${post.id}`} className="block">
    <Card>
      <CardHeader>
        <CardTitle className='text-xl '>{post.title}</CardTitle>
      </CardHeader>
      <CardContent className=' ml-4'>
        <RichTextRenderer content={post.content.substring(0, 200)} />
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-md text-muted-foreground">
          <p>By {post.author.username}  {new Date(post.createdAt).toLocaleDateString("en-US",{
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })} {"   "} {
              new Date(post.createdAt).toLocaleTimeString("en-US", {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              })
            }</p>
        </div>
        
      </CardFooter>
    </Card>
    </Link>
  );
};

export default PostCard;
