import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reaction, ReactionDocument, ReactionType } from './reaction.schema';
// import { Post, PostDocument } from 'src/posts/post.schema';

@Injectable()
export class ReactionService {
  constructor(
    // @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @InjectModel(Reaction.name) private reactionModel: Model<ReactionDocument>,
  ) {}

  async addOrUpdateReaction(
    userId: string,
    postId: string,
    type: ReactionType,
  ) {
    const existing = await this.reactionModel.findOne({
      user: userId,
      post: postId,
    });

    if (existing && existing.type === type) {
      await this.reactionModel.deleteOne({ _id: existing._id });
      return null;
    }
    return this.reactionModel.findOneAndUpdate(
      { user: userId, post: postId },
      { type },
      { upsert: true, new: true },
    );
  }

  async getReactionsByPost(postId: string) {
    const reactions = await this.reactionModel.find({ post: postId });

    const summary = reactions.reduce(
      (acc, r) => {
        acc[r.type] = (acc[r.type] || 0) + 1;
        return acc;
      },
      {} as Record<ReactionType, number>,
    );
    // const
    console.log(reactions);
    return {
      reactions,
      total: reactions.length,
      summary,
    };
  }
}
// async toggleReaction(postId: string, type: ReactionType, userId: string) {
//   const post = await this.postModel.findById(postId);
//   if (!post) throw new NotFoundException('Post not found');

//   const existing = await this.reactionModel.findOne({
//     post: postId,
//     user: userId,
//     type,
//   });
//   console.log(post, existing);
//   if (existing) {
//     // Remove reaction
//     await this.reactionModel.deleteOne({ _id: existing._id });
//   } else {
//     // Add reaction
//     await this.reactionModel.create({
//       post: postId,
//       user: userId,
//       type,
//     });
//   }

//   // Optionally, return all updated reactions for the post
//   const updatedReactions = await this.reactionModel.find({ post: postId });
//   console.log(updatedReactions);
//   return updatedReactions;
// }
