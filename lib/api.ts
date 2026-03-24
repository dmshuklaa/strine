import axios from 'axios';
import { Config } from '@/constants/Config';
import { supabase } from './supabase';

export const api = axios.create({
  baseURL: Config.apiUrl,
  timeout: 30_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Supabase JWT to every request
api.interceptors.request.use(async (config) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }

  return config;
});

// Standardised error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.error ?? error.message ?? 'An unexpected error occurred';
    return Promise.reject(new Error(message));
  },
);
