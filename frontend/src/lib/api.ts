import { ILoginCredentials, IRegisterCredentials } from '@/types';
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
  const response = await fetch(`${API_BASE_URL}/auth/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  if(response.status === 200) toast.success('Logged in successfully')
  return handleResponse(response);
};

export const registerEndpoint = async (data: IRegisterCredentials) => {
  const response = await fetch(`${API_BASE_URL}/auth/register/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if(response.status === 200) toast.success('User created successfully')
  return handleResponse(response);
};