import { ILoginCredentials, IRegisterCredentials, CreatePostDto, UpdatePostDto } from '@/types';
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
export const loginEndpoint = async (credentials: ILoginCredentials) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  if(response.ok) toast.success('Logged in successfully')
  return handleResponse(response);
};

export const registerEndpoint = async (data: IRegisterCredentials) => {
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
