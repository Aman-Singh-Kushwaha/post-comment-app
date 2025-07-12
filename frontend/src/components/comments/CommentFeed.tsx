'use client';

import { useEffect, useState, useCallback } from 'react';
import { getCommentsByPostId } from '@/lib/api';
import { Comment } from '@/types';
import { CommentCard } from './CommentCard';
import { CommentForm } from './CommentForm';
import { toast } from 'sonner';

interface CommentFeedProps {
  postId: string;
}

export const CommentFeed = ({ postId }: CommentFeedProps) => {
  const [comments, setComments] = useState<Comment[]>([]);

  const fetchComments = useCallback(async () => {
    try {
      const fetchedComments = await getCommentsByPostId(postId);
      setComments(fetchedComments);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
      toast.error('Failed to fetch comments');
    }
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Comments</h2>
      <CommentForm postId={postId} onCommentPosted={fetchComments} />
      <div className="space-y-4 mt-4">
        {comments.map((comment) => (
          comment.id ? (
            <CommentCard key={comment.id} postId={postId} comment={comment} onCommentAction={fetchComments} />
          ) : null
        ))}
      </div>
    </div>
  );
};