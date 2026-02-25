import axios, { AxiosError } from "axios";
import { getSession } from "next-auth/react";
import type { AuthResponse, MeResponse } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Create an Axios instance with the base URL and default headers
export const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add a request interceptor to set the Authorization header with the token from the session
api.interceptors.request.use(async (config) => {
    const session = await getSession();
    if (session?.token) {
        config.headers.Authorization = `Bearer ${session.token}`;
    }
    return config;
},
    (error) => Promise.reject(error)
);

// Add a response interceptor to handle errors and extract error messages
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    const message =
      error.response?.data?.message || error.message || "Something went wrong.";
    return Promise.reject(new Error(message));
  }
);

export async function register(
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  const { data } = await axios.post<AuthResponse>(`${API_URL}/api/auth/register`, {
    name,
    email,
    password,
  });
  return data;
}

export async function login(
  email: string,
  password: string
): Promise<AuthResponse> {
  const { data } = await axios.post<AuthResponse>(`${API_URL}/api/auth/login`, {
    email,
    password,
  });
  return data;
}

export async function getMe(): Promise<MeResponse> {
  const { data } = await api.get<MeResponse>("/api/auth/me");
  return data;
}

