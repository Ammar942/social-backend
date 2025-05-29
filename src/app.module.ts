import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './users/user/user.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsModule } from './posts/posts.module';
import { CommentModule } from './comments/comment.module';
import { ReactionModule } from './reactions/reaction.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGODB_URI!),
    UserModule,
    AuthModule,
    PostsModule,
    CommentModule,
    ReactionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
