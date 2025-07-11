import { Controller, Post, Body, UseGuards, Request, Get, Param } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateCommentDto } from './dto/create-comment.dto';

interface IRequestWithUser extends Request {
  user: {
    id: string;
  };
}

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() createCommentDto: CreateCommentDto, @Request() req: IRequestWithUser) {
    return this.commentsService.create(createCommentDto, req.user.id);
  }

  @Get(':postId')
  findByPost(@Param('postId') postId: string) {
    return this.commentsService.findByPost(postId);
  }

  @Get(':postId/replies/:commentId')
  findReplies(@Param('commentId') commentId: string) {
    return this.commentsService.findReplies(commentId);
  }
}