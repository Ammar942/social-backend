import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './post.schema';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { S3Module } from '../common/s3/s3.module';
import { CommentModule } from 'src/comments/comment.module';
import { ReactionModule } from 'src/reactions/reaction.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    S3Module,
    CommentModule,
    ReactionModule,
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
