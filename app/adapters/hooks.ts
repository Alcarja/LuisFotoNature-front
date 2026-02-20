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

export const useGetAllComments = () => {
  return useQuery({
    queryKey: ["allComments"],
    queryFn: () => api.getAllComments(),
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

// BREVO
export const useSendPostCampaignEmail = () => {
  return useMutation({
    mutationFn: ({ postId }: { postId: number }) =>
      api.sendPostCampaignEmail(postId),
  });
};

export const useGetAllSubscribers = () => {
  return useQuery({
    queryKey: ["subscribers"],
    queryFn: () => api.getAllSubscibers(),
  });
};

//GALLERIES
export const useGetAllGalleries = () => {
  return useQuery({
    queryKey: ["allGalleries"],
    queryFn: () => api.getAllGalleries(),
  });
};

export const useCreateGallery = () => {
  return useMutation({
    mutationFn: (data: {
      userId: number;
      name: string;
      continent: string;
      place: string;
    }) => api.createGallery(data),
  });
};

export const useCreateGalleryImage = () => {
  return useMutation({
    mutationFn: (data: { galleryId: number; url: string }) =>
      api.createGalleryImage(data),
  });
};

export const useGetGalleryById = (galleryId: number) => {
  return useQuery({
    queryKey: ["gallery", galleryId],
    queryFn: () => api.getGalleryById(galleryId),
  });
};

export const useGetGalleryImagesByGalleryId = (galleryId: number) => {
  return useQuery({
    queryKey: ["galleryImages", galleryId],
    queryFn: () => api.getGalleryImagesByGalleryId(galleryId),
  });
};

export const useUpdateGallery = () => {
  return useMutation({
    mutationFn: ({
      galleryId,
      data,
    }: {
      galleryId: number;
      data: {
        name?: string;
        continent?: string;
        place?: string;
        active?: boolean;
      };
    }) => api.updateGallery(galleryId, data),
  });
};
