import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  UseGuards,
  Request,
  Patch,
  Delete,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ResponseHelper } from 'src/common/helper/response.helper';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('posts/:postId/comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createComment(
    @Param('postId') postId: string,
    @Body() createCommentDto: CreateCommentDto,
    @Request() req,
  ) {
    console.log(createCommentDto);
    const comment = await this.commentService.create(
      createCommentDto.text,
      req.user.userId,
      postId,
    );
    return ResponseHelper.success(comment, 'Commented  successfully');
    // return this.commentService.create(text, req.user.userId, postId);
  }

  @Get()
  async getComments(@Param('postId') postId: string) {
    const comments = await this.commentService.findByPost(postId);
    return ResponseHelper.success(comments, 'Comments fetched successfully');
    // return this.commentService.findByPost(postId);
  }
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateComment(@Param('id') id: string, @Body() body: CreateCommentDto) {
    const comment = await this.commentService.update(id, body.text);
    return ResponseHelper.success(comment, 'Comment updated successfully');
  }
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteComment(@Param('id') id: string) {
    await this.commentService.delete(id);
    return ResponseHelper.success(null, 'Comment deleted successfully');
  }
}
