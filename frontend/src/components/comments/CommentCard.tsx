'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getReplies } from '@/lib/api';
import { Comment } from '@/types';
import { CommentForm } from './CommentForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import RichTextRenderer from '@/components/RichTextRenderer';
import { toast } from 'sonner';

interface CommentCardProps {
  postId: string;
  comment: Comment;
  onCommentAction: () => void;
}

export const CommentCard = ({ postId, comment, onCommentAction }: CommentCardProps) => {
  const { user } = useAuth();
  const [replies, setReplies] = useState<Comment[]>([]);
  const [showReplies, setShowReplies] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const router = useRouter();

  const handleShowReplies = async () => {
    if (!showReplies) {
      try {
        const fetchedReplies = await getReplies(postId, comment.id);
        setReplies(fetchedReplies);
      } catch (error) {
        console.error('Failed to fetch replies:', error);
        toast.error('Failed to fetch replies');
      }
    }
    setShowReplies(!showReplies);
  };

  const handleReplySuccess = () => {
    setIsReplying(false);
    handleShowReplies(); // Refresh replies
  };

  const handleReplyClick = () => {
    if (!user) {
      router.push('/login');
    } else {
      setIsReplying(!isReplying);
    }
  };

  return (
    <Card className="my-4 bg-neutral-100 border-none shadow-none">
      <CardTitle className="p-2 pb-0">
        <div className="flex items-center space-x-4">
          <div className="font-bold">{comment.author?.username}</div>
          {/* <div className="text-sm text-muted-foreground">
            {new Date(comment.createdAt).toLocaleDateString("en-US",{
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })} {"   "} {
              new Date(comment.createdAt).toLocaleTimeString("en-US", {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              })
            }
          </div> */}
        </div>
      </CardTitle>

      <CardContent>
        <RichTextRenderer content={comment.content} />
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="space-x-4">
          {+comment.childrenCount > 0 && (
            <Button variant="ghost" onClick={handleShowReplies}>
              {showReplies ? 'Hide' : `Show ${comment.childrenCount} replies`}
            </Button>
          )}
          <Button variant="ghost" onClick={handleReplyClick}>Reply</Button>
        </div>
      </CardFooter>

      {isReplying && (
        <div className="pl-4 border-l-2 ml-4">
          <CommentForm postId={postId} parentId={comment.id} onCommentPosted={handleReplySuccess} />
        </div>
      )}

      {showReplies && (
        <div className="pl-4 border-l-2 ml-4">
          {replies.map(reply => (
            <CommentCard key={reply.id} postId={postId} comment={reply} onCommentAction={handleShowReplies} />
          ))}
        </div>
      )}
    </Card>
  );
};