'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { createComment } from '@/lib/api';
import { Button } from '@/components/ui/button';
import RichTextEditor from '@/components/RichTextEditor';

interface CommentFormProps {
  postId: string;
  parentId?: string | null;
  onCommentPosted: () => void;
}

export const CommentForm = ({ postId, parentId = null, onCommentPosted }: CommentFormProps) => {
  const { user, token } = useAuth();
  const [content, setContent] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !token) {
      router.push('/login');
      return;
    }
    await createComment({ content, postId, parentId: parentId || undefined }, token);
    setContent('');
    onCommentPosted();
  };

  return (
    <form onSubmit={handleSubmit} className="my-4">
      <RichTextEditor value={content} onChange={setContent} minHeight="min-h-[100px]" />
      <Button type="submit" className="mt-2">
        Post Comment
      </Button>
    </form>
  );
};