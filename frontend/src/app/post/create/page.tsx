'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { createPost } from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import RichTextEditor from '@/components/RichTextEditor';

export default function CreatePostPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const newPost = await createPost({ title, content }, token);
      router.push(`/post/${newPost.id}`);
    } catch (error) {
      console.error('Failed to create post', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create Post</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <RichTextEditor value={content} onChange={setContent} minHeight="min-h-[400px]" />
        <Button type="submit">Create Post</Button>
      </form>
    </div>
  );
}