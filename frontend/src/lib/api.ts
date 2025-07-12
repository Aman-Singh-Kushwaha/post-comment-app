import { LoginCredentials, RegisterCredentials, CreatePostDto, UpdatePostDto, CreateCommentDto } from '@/types';
import {toast} from 'sonner';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';


const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json();
    toast.error(`${error.error || ''} Error`, {
      description: (error.message || 'Something went wrong')
    })
    throw new Error(error.message || 'Something went wrong');
  }
  if (response.status === 204) { // No Content
    return;
  }
  return response.json();
};

// Auth
export const login = async (credentials: LoginCredentials) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  if(response.ok) toast.success('Logged in successfully')
  return handleResponse(response);
};

export const register = async (data: RegisterCredentials) => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if(response.ok) toast.success('User created successfully')
  return handleResponse(response);
};

// Posts
export const getPosts = async () => {
  const response = await fetch(`${API_BASE_URL}/posts`);
  return handleResponse(response);
};

export const getPostById = async (id: string) => {
  const response = await fetch(`${API_BASE_URL}/posts/${id}`);
  return handleResponse(response);
};

export const createPost = async (data: CreatePostDto, token: string) => {
  const response = await fetch(`${API_BASE_URL}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (response.ok) toast.success('Post created successfully');
  return handleResponse(response);
};

export const updatePost = async (id: string, data: UpdatePostDto, token: string) => {
  const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (response.ok) toast.success('Post updated successfully');
  return handleResponse(response);
};

export const deletePost = async (id: string, token: string) => {
  const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (response.ok) toast.success('Post deleted successfully');
  return handleResponse(response);
};

// Comments
export const getCommentsByPostId = async (postId: string) => {
  const response = await fetch(`${API_BASE_URL}/comments/${postId}`);
  return handleResponse(response);
};

export const getReplies = async (postId: string, commentId: string) => {
  const response = await fetch(`${API_BASE_URL}/comments/${postId}/replies/${commentId}`);
  return handleResponse(response);
};

export const createComment = async (data: CreateCommentDto, token: string) => {
  const response = await fetch(`${API_BASE_URL}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (response.ok) toast.success('Comment posted successfully');
  return handleResponse(response);
};
