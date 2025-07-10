import { ILoginCredentials, IRegisterCredentials } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// TODO: add toast for errors
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json();
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
  return handleResponse(response);
};

export const registerEndpoint = async (data: IRegisterCredentials) => {
  const response = await fetch(`${API_BASE_URL}/auth/register/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};