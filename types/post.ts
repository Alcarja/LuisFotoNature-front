export interface Post {
  id: number;
  title: string;
  featuredImage?: string;
  content?: string;
  owner?: number;
  category?: string;
  slug?: string;
  createdAt: string | Date;
  updatedAt?: string | Date;
  active?: boolean;
  campaignSent?: boolean;
}
