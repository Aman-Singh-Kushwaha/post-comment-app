'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getPostById, updatePost } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Post } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import RichTextEditor from '@/components/RichTextEditor';

export default function EditPostPage() {
  const { token } = useAuth();
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  useEffect(() => {
    if (id) {
      const fetchPost = async () => {
        try {
          const fetchedPost = await getPostById(id);
          setPost(fetchedPost);
          setTitle(fetchedPost.title);
          setContent(fetchedPost.content);
        } catch (error) {
          console.error('Failed to fetch post', error);
        }
      };

      fetchPost();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !post) return;

    try {
      await updatePost(post.id, { title, content }, token);
      router.push(`/post/${post.id}`);
    } catch (error) {
      console.error('Failed to update post', error);
    }
  };

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Post</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <RichTextEditor value={content} onChange={setContent} minHeight="min-h-[400px]" />
        <Button type="submit">Update Post</Button>
      </form>
    </div>
  );
}
