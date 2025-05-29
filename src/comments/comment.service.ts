import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentDocument } from './comment.schema';
import { Model } from 'mongoose';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
  ) {}

  async create(text: string, userId: string, postId: string): Promise<Comment> {
    const comment = new this.commentModel({
      text,
      author: userId,
      post: postId,
    });
    const savedComment = await comment.save();
    await savedComment.populate('author', 'username');
    return savedComment;
  }

  async findByPost(postId: string): Promise<Comment[]> {
    return this.commentModel
      .find({ post: postId })
      .sort({ createdAt: 1 })
      .populate('author', 'username');
  }
  async update(id: string, text: string): Promise<Comment> {
    const comment = await this.commentModel
      .findByIdAndUpdate(id, { text }, { new: true })
      .populate('author', 'username');
    if (!comment) throw new NotFoundException('Comment not found');
    return comment;
  }
  async delete(id: string): Promise<void> {
    const comment = await this.commentModel.findByIdAndDelete(id);
    if (!comment) throw new NotFoundException('Comment not found');
  }
}
