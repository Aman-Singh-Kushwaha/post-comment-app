import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async create(createPostDto: CreatePostDto, authorId: string): Promise<Post> {
    if (!createPostDto.title || !createPostDto.content) {
      throw new BadRequestException('Title and content are required');
    }
    const post = this.postRepository.create({
      ...createPostDto,
      author: { id: authorId },
    });
    return this.postRepository.save(post);
  }

  async findAll(): Promise<Post[]> {
    return this.postRepository.find({
      relations: ['author'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['author'],
    });
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    return post;
  }

  async update(
    id: string,
    updatePostDto: UpdatePostDto,
    userId: string,
  ): Promise<Post> {
    const post = await this.findOne(id);
    if (post.author.id !== userId) {
      throw new ForbiddenException(
        'You are not authorized to update this post',
      );
    }
    if (!updatePostDto.title && !updatePostDto.content) {
      throw new BadRequestException('Either title or content must be provided');
    }
    Object.assign(post, updatePostDto);
    return this.postRepository.save(post);
  }

  async remove(id: string, userId: string): Promise<void> {
    const post = await this.findOne(id);
    if (post.author.id !== userId) {
      throw new ForbiddenException(
        'You are not authorized to delete this post',
      );
    }
    await this.postRepository.remove(post);
  }
}
