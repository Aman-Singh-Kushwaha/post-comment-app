'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getPostById, deletePost } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Post } from '@/types';
import RichTextRenderer from '@/components/RichTextRenderer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function PostPage() {
  const { user, token } = useAuth();
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const id = Array.isArray(params.id) ? params.id[0] : params.id;


  useEffect(() => {
    if (id) {
      const fetchPost = async () => {
        try {
          const fetchedPost = await getPostById(id);
          setPost(fetchedPost);
        } catch (error) {
          console.error('Failed to fetch post', error);
        }
      };

      fetchPost();
    }
  }, [id]);

  const handleDelete = async () => {
    if (!token || !post) return;

    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePost(post.id, token);
        router.push('/');
      } catch (error) {
        console.error('Failed to delete post', error);
      }
    }
  };

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
      <div className="text-sm text-muted-foreground mb-4">
        By {post.author.username} on {new Date(post.createdAt).toLocaleDateString()}
      </div>
      <RichTextRenderer content={post.content} />
      {user?.id === post.author.id && (
        <div className="mt-4 space-x-2">
          <Button asChild>
            <Link href={`/post/${post.id}/edit`}>Edit</Link>
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      )}
    </div>
  );
}
