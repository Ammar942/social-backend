import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../users/user/user.schema';

export type PostDocument = Post & Document;

export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
}

@Schema({ timestamps: true })
export class Post {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  mediaUrl: string;

  @Prop({ enum: MediaType, required: true })
  mediaType: MediaType;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  author: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Post.name, default: null })
  sharedFrom?: Types.ObjectId;
}

export const PostSchema = SchemaFactory.createForClass(Post);
