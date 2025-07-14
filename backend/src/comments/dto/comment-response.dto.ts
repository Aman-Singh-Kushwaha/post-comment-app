interface AuthorDto {
  id: string;
  username: string;
}

export class CommentResponseDto {
  id: string;
  content: string;
  parentId: string | null;
  isEdited: boolean;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  author: AuthorDto;
  childrenCount: number;
}
