'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getPosts } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Post } from '@/types';
import PostCard from '@/components/PostCard';
import { Button } from '@/components/ui/button';

export default function Home() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const fetchedPosts = await getPosts();
        setPosts(fetchedPosts);
      } catch (error) {
        console.error('Failed to fetch posts', error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Posts Feed</h1>
        {user && (
          <Button asChild>
            <Link href="/post/create">Create Post</Link>
          </Button>
        )}
      </div>
      <div className="grid gap-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}