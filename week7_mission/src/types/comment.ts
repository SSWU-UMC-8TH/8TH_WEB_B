// types/comment.ts
export type Author = {
  id: number;
  name: string;
  email: string;
  bio: string | null;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Comment = {
  user: any;
  userId: number | undefined;
  id: number;
  content: string;
  lpId: number;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  author: Author;
};

export type CreateCommentDto = {
  content: string;
};
