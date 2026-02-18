import stpApi from "@/app/utils/stp-api";
import type {
  LoginCredentials,
  RegisterData,
  AuthResponse,
} from "@/types/auth";
import type { User } from "@/types/user";

// AUTH
export const login = async (
  credentials: LoginCredentials,
): Promise<AuthResponse> => {
  return stpApi.post("/api/auth/login", credentials);
};

export const logout = async (): Promise<void> => {
  return stpApi.post("/api/auth/logout", {});
};

export const getCurrentUser = async (): Promise<User> => {
  return stpApi.get("/api/auth/me");
};

export const register = async (
  userData: RegisterData,
): Promise<AuthResponse> => {
  return stpApi.post("/api/auth/register", userData);
};

// POSTS
export const createPost = async (postData: {
  userId: number;
  title: string;
  category: string;
}) => {
  return stpApi.post("/api/posts/create-post", { postData });
};

export const getAllPosts = async () => {
  return stpApi.get("/api/posts/get-all-posts", {});
};

export const getAllActivePosts = async () => {
  return stpApi.get("/api/posts/get-all-active-posts", {});
};

export const getPostById = async (postId: number) => {
  return stpApi.get(`/api/posts/get-post-by-id/${postId}`, {});
};

export const updatePost = async (
  postId: number,
  data: {
    postData: {
      title?: string;
      featuredImage?: string;
      content?: string;
      category?: string;
      active?: boolean;
    };
    imageUrlsToDelete?: string[];
  },
) => {
  return stpApi.put(`/api/posts/update-post/${postId}`, data);
};

// COMMENTS
export const createComment = async (
  postId: number,
  data: { comment: string; email: string },
) => {
  return stpApi.post(`/api/comments/create-comment/${postId}`, { data });
};

export const getCommentsByPostId = async (postId: number) => {
  return stpApi.get(`/api/comments/get-comments-by-post-id/${postId}`, {});
};

export const getAllComments = async () => {
  return stpApi.get(`/api/comments/get-all-comments`, {});
};

export const getApprovedCommentsByPostId = async (postId: number) => {
  return stpApi.get(
    `/api/comments/get-approved-comments-by-post-id/${postId}`,
    {},
  );
};

export const updateComment = async (
  commentId: number,
  data: { approved?: boolean },
) => {
  return stpApi.put(`/api/comments/update-comment/${commentId}`, data);
};

// BREVO
export const subscribe = async (email: string) => {
  return stpApi.post(`/api/emails/suscribe`, { email });
};
