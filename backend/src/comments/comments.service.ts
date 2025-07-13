import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Comment } from './comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';

interface RawCommentData {
  comment_id: string;
  comment_content: string;
  comment_parentId: string | null;
  comment_isEdited: boolean;
  comment_isDeleted: boolean;
  comment_deletedAt: string | null;
  comment_createdAt: string;
  comment_updatedAt: string;
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

  async create(
    createCommentDto: CreateCommentDto,
    authorId: string,
  ): Promise<Comment> {
    if (!createCommentDto.content || createCommentDto.content.trim() === '') {
      throw new BadRequestException('Comment content cannot be empty');
    }

    const newComment = new Comment();
    newComment.content = createCommentDto.content;
    newComment.author = { id: authorId } as any;
    newComment.post = { id: createCommentDto.postId } as any;
    if (createCommentDto.parentId) {
      newComment.parentId = createCommentDto.parentId;
    }

    return this.commentRepository.save(newComment);
  }

  async findByPost(postId: string): Promise<RawCommentData[]> {
    const comments = await this.getCommentQueryBuilder()
      .andWhere('comment.postId = :postId', { postId })
      .andWhere('comment.parentId IS NULL')
      .orderBy('comment.createdAt', 'DESC')
      .getRawMany<RawCommentData>();

    return comments.map((comment) => ({
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
      childrenCount: parseInt(comment.childrenCount),
    }));
  }

  async findReplies(commentId: string): Promise<RawCommentData[]> {
    const replies = await this.getCommentQueryBuilder()
      .andWhere('comment.parentId = :commentId', { commentId })
      .orderBy('comment.createdAt', 'ASC')
      .getRawMany<RawCommentData>();

    return replies.map((reply) => ({
      id: reply.comment_id,
      content: reply.comment_content,
      parentId: reply.comment_parentId,
      isEdited: reply.comment_isEdited,
      isDeleted: reply.comment_isDeleted,
      deletedAt: reply.comment_deletedAt,
      createdAt: reply.comment_createdAt,
      updatedAt: reply.comment_updatedAt,
      author: {
        id: reply.author_id,
        username: reply.author_username,
      },
      childrenCount: parseInt(reply.childrenCount),
    }));
  }
}
