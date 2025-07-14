import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Comment } from './comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentResponseDto } from './dto/comment-response.dto';
import { User } from '../user/user.entity';
import { Post as PostEntity } from '../posts/post.entity';

interface RawCommentData {
  comment_id: string;
  comment_content: string;
  comment_parentId: string | null;
  comment_isEdited: boolean;
  comment_isDeleted: boolean;
  comment_deletedAt: Date | null;
  comment_createdAt: Date;
  comment_updatedAt: Date;
  author_id: string;
  author_username: string;
  childrenCount: string;
}

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private readonly dataSource: DataSource,
  ) {}

  private getChildrenCountSubquery() {
    return this.commentRepository
      .createQueryBuilder('sub_comment')
      .select('COUNT(*)')
      .where('sub_comment.parentId = comment.id')
      .andWhere('sub_comment.is_deleted = false')
      .getQuery();
  }

  private getCommentQueryBuilder() {
    return this.commentRepository
      .createQueryBuilder('comment')
      .select([
        'comment.id',
        'comment.content',
        'comment.parentId',
        'comment.isEdited',
        'comment.isDeleted',
        'comment.deletedAt',
        'comment.createdAt',
        'comment.updatedAt',
        'author.id',
        'author.username',
      ])
      .addSelect(`(${this.getChildrenCountSubquery()})`, 'childrenCount')
      .leftJoin('comment.author', 'author');
  }

  private mapRawToDto = (comment: RawCommentData): CommentResponseDto => {
    return {
      id: comment.comment_id,
      content: comment.comment_content,
      parentId: comment.comment_parentId,
      isEdited: comment.comment_isEdited,
      isDeleted: comment.comment_isDeleted,
      deletedAt: comment.comment_deletedAt,
      createdAt: comment.comment_createdAt,
      updatedAt: comment.comment_updatedAt,
      author: {
        id: comment.author_id,
        username: comment.author_username,
      },
      childrenCount: parseInt(comment.childrenCount, 10) || 0,
    };
  };

  async create(
    createCommentDto: CreateCommentDto,
    authorId: string,
  ): Promise<Comment> {
    if (!createCommentDto.content || createCommentDto.content.trim() === '') {
      throw new BadRequestException('Comment content cannot be empty');
    }

    const newComment = new Comment();
    newComment.content = createCommentDto.content;
    newComment.author = { id: authorId } as User;
    newComment.post = { id: createCommentDto.postId } as PostEntity;
    if (createCommentDto.parentId) {
      newComment.parentId = createCommentDto.parentId;
    }

    return this.commentRepository.save(newComment);
  }

  async findByPost(postId: string): Promise<CommentResponseDto[]> {
    const comments = await this.getCommentQueryBuilder()
      .andWhere('comment.postId = :postId', { postId })
      .andWhere('comment.parentId IS NULL')
      .orderBy('comment.createdAt', 'DESC')
      .getRawMany<RawCommentData>();

    return comments.map(this.mapRawToDto);
  }

  async findReplies(commentId: string): Promise<CommentResponseDto[]> {
    const replies = await this.getCommentQueryBuilder()
      .andWhere('comment.parentId = :commentId', { commentId })
      .orderBy('comment.createdAt', 'ASC')
      .getRawMany<RawCommentData>();

    return replies.map(this.mapRawToDto);
  }
}
