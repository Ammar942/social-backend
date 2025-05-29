import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type ReactionDocument = Reaction & Document;

export enum ReactionType {
  LIKE = 'like',
  LOVE = 'love',
  FUNNY = 'funny',
}

@Schema({ timestamps: true })
export class Reaction {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true })
  post: mongoose.Types.ObjectId;

  @Prop({ enum: ReactionType, required: true })
  type: ReactionType;
}

export const ReactionSchema = SchemaFactory.createForClass(Reaction);
