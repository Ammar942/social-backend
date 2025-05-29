import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Body,
  Request,
  BadRequestException,
  Get,
  Param,
  NotFoundException,
  Query,
  Patch,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PostsService } from './posts.service';
import { S3Service } from '../common/s3/s3.service';
import { MediaType, PostDocument } from './post.schema';
import * as mime from 'mime-types';
import { Types } from 'mongoose';
import { ResponseHelper } from 'src/common/helper/response.helper';
import { CreatePostDto } from './dto/create-post.dto';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly s3Service: S3Service,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  @UseInterceptors(FileInterceptor('media'))
  async createPost(
    @UploadedFile() file: Express.Multer.File,
    @Body() createPostDto: CreatePostDto,
    @Request() req: any,
  ) {
    if (!file) throw new BadRequestException('No media file provided');
    console.log(createPostDto);
    const mediaUrl = await this.s3Service.uploadFile(file);
    const type = mime.lookup(file.originalname)?.startsWith('video')
      ? MediaType.VIDEO
      : MediaType.IMAGE;
    const post = await this.postsService.create({
      title: createPostDto.title,
      description: createPostDto.description,
      mediaUrl,
      mediaType: type,
      author: req.user.userId,
    });
    return ResponseHelper.success(post, 'Post created successfully');
    // return post;
  }
  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  async getUserPosts(@Request() req) {
    const userId = req.user.userId;

    const original = await this.postsService.findByUser(userId);
    const shared = await this.postsService.findSharedByUser(userId);
    return ResponseHelper.success(
      {
        originalPosts: original.filter((p) => !p.sharedFrom),
        sharedPosts: shared,
      },
      'Posts fetched successfully',
    );
    // return {
    //   originalPosts: original.filter((p) => !p.sharedFrom),
    //   sharedPosts: shared,
    // };
  }

  @Get()
  async getAllPosts(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const posts = await this.postsService.findAll(page, limit);
    return ResponseHelper.success(posts, 'Posts fetched successfully');
    // return this.postsService.findAll();
  }
  @Get(':id')
  async getPost(@Param('id') id: string) {
    const post = await this.postsService.findById(id);
    console.log(post);
    return ResponseHelper.success(post, 'Post fetched successfully');
    // return this.postsService.findAll();
  }
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('media'))
  async updatePost(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
    @Body() updateData: any,
    @Request() req,
  ) {
    const userId = req.user?.userId;

    let mediaUrl: string | undefined;
    let mediaType: MediaType | undefined;

    if (file) {
      mediaUrl = await this.s3Service.uploadFile(file);
      mediaType = mime.lookup(file.originalname)?.startsWith('video')
        ? MediaType.VIDEO
        : MediaType.IMAGE;

      updateData.mediaUrl = mediaUrl;
      updateData.mediaType = mediaType;
    }

    const updatedPost = await this.postsService.updatePost(
      id,
      updateData,
      userId,
    );
    return ResponseHelper.success(updatedPost, 'Post updated successfully');
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deletePost(@Param('id') id: string, @Request() req) {
    const userId = req.user?.userId;
    return this.postsService.deletePost(id, userId);
  }
  @UseGuards(JwtAuthGuard)
  @Post(':id/share')
  async sharePost(@Param('id') id: string, @Body() body, @Request() req) {
    const originalPost = (await this.postsService.findById(id)) as PostDocument;
    if (!originalPost) {
      throw new NotFoundException('Original post not found');
    }
    console.log(originalPost);
    console.log(body);
    const sharedPost = await this.postsService.create({
      title: body?.title || originalPost.title,
      description: body?.description || originalPost.description,
      mediaUrl: originalPost.mediaUrl,
      mediaType: originalPost.mediaType,
      author: req.user.userId,
      sharedFrom: Types.ObjectId.createFromHexString(
        (originalPost as any)._id.toString(),
      ),
    });
    return ResponseHelper.success(
      sharedPost,
      'Shared Post fetched successfully',
    );
    // return sharedPost;
  }
}
