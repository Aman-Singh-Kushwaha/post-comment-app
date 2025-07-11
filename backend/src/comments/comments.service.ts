import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Comment } from './comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';

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

  async create(createCommentDto: CreateCommentDto, authorId: string): Promise<Comment> {
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


  async findByPost(postId: string): Promise<any[]> {
    return this.getCommentQueryBuilder()
      .andWhere('comment.postId = :postId', { postId })
      .andWhere('comment.parentId IS NULL')
      .orderBy('comment.createdAt', 'DESC')
      .getRawMany();
  }

  async findReplies(commentId: string): Promise<any[]> {
    return this.getCommentQueryBuilder()
      .andWhere('comment.parentId = :commentId', { commentId })
      .orderBy('comment.createdAt', 'ASC')
      .getRawMany();
  }
}
