export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  password: string;
}

export interface Author {
  id: string;
  username: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  author: Author;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostDto {
  title: string;
  content: string;
}

export interface UpdatePostDto {
  title?: string;
  content?: string;
}

export interface Comment {
  id: string;
  content: string;
  parentId: string | null;
  isEdited: boolean;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  author: Author;
  childrenCount: string;
}

export interface CreateCommentDto {
  content: string;
  postId: string;
  parentId?: string;
}
