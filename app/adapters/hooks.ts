/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery } from "@tanstack/react-query";
import * as api from "./api";
import { LoginCredentials } from "@/types/auth";

// 🧑‍💻 Auth
export const useRegister = () => {
  return useMutation({
    mutationFn: (userData: {
      name: string;
      lastName: string;
      email: string;
      password: string;
    }) => api.register(userData),
  });
};

export const useLogin = () => {
  return useMutation({
    mutationFn: (credentials: LoginCredentials) => api.login(credentials),
  });
};

export const useLogout = () => {
  return useMutation({
    mutationFn: () => api.logout(),
  });
};

// POSTS
export const useCreatePost = () => {
  return useMutation({
    mutationFn: (postData: {
      userId: number;
      title: string;
      category: string;
    }) => api.createPost(postData),
  });
};

export const useGetAllPosts = () => {
  return useQuery({
    queryKey: ["posts"],
    queryFn: () => api.getAllPosts(),
  });
};

export const useGetAllActivePosts = () => {
  return useQuery({
    queryKey: ["activePosts"],
    queryFn: () => api.getAllActivePosts(),
  });
};

export const useGetPostById = (postId: number) => {
  return useQuery({
    queryKey: ["post", postId],
    queryFn: () => api.getPostById(postId),
  });
};

export const useUpdatePost = () => {
  return useMutation({
    mutationFn: ({
      postId,
      postData,
      imageUrlsToDelete,
    }: {
      postId: number;
      postData: {
        title?: string;
        featuredImage?: string;
        content?: string;
        category?: string;
        active?: boolean;
      };
      imageUrlsToDelete?: string[];
    }) => api.updatePost(postId, { postData, imageUrlsToDelete }),
  });
};

// COMMENTS
export const useGetCommentsByPostId = (postId: number) => {
  return useQuery({
    queryKey: ["comments", postId],
    queryFn: () => api.getCommentsByPostId(postId),
  });
};

export const useGetApprovedCommentsByPostId = (postId: number) => {
  return useQuery({
    queryKey: ["approvedComments", postId],
    queryFn: () => api.getApprovedCommentsByPostId(postId),
  });
};

export const useCreateComment = () => {
  return useMutation({
    mutationFn: ({
      postId,
      comment,
      email,
    }: {
      postId: number;
      comment: string;
      email: string;
    }) => api.createComment(postId, { comment, email }),
  });
};

export const useUpdateComment = () => {
  return useMutation({
    mutationFn: ({
      commentId,
      approved,
    }: {
      commentId: number;
      approved: boolean;
    }) => api.updateComment(commentId, { approved }),
  });
};
