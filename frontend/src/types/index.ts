export interface ILoginCredentials {
  username: string;
  password: string;
}

export interface IRegisterCredentials {
  username: string;
  password: string;
}

export interface IAuthor {
  id: string;
  username: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  author: IAuthor;
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
