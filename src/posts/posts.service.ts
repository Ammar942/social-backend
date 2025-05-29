import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from './post.schema';
import { Model } from 'mongoose';
import { Reaction, ReactionType } from 'src/reactions/reaction.schema';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @InjectModel('Comment') private commentModel: Model<Comment>,
    @InjectModel('Reaction') private reactionModel: Model<Reaction>,
  ) {}

  async create(postData: Partial<Post>): Promise<Post> {
    const newPost = new this.postModel(postData);
    return newPost.save();
  }
  private async addPostDetails(post: any) {
    const postId = post._id;

    const comments = await this.commentModel
      .find({ post: postId })
      .populate('author', 'username')
      // .populate({
      //   path: 'sharedFrom',
      //   strictPopulate: false,
      //   populate: { path: 'author', select: 'username' },
      // })
      .sort({ createdAt: 1 })
      .lean();

    const reactions = await this.reactionModel.find({ post: postId }).lean();

    const reactionSummary = reactions.reduce(
      (acc, r) => {
        acc[r.type] = (acc[r.type] || 0) + 1;
        return acc;
      },
      {} as Record<ReactionType, number>,
    );
    console.log(reactions);
    return {
      ...post,
      comments,
      reactions: {
        reactions,
        total: reactions.length,
        summary: reactionSummary,
        // userReactionType: reactions.find((r) => r.user.toString() === userId)
        //   ?.type,
      },
    };
  }

  async findAll(page = 1, limit = 10): Promise<Post[]> {
    const skip = (page - 1) * limit;
    console.log(skip, limit);
    const posts = await this.postModel
      .find()
      .sort({ createdAt: -1 })
      .populate('author', 'username')
      .populate({
        path: 'sharedFrom',
        select: 'author title mediaUrls',
        populate: {
          path: 'author',
          select: 'username email',
        },
      })
      .skip(skip)
      .limit(limit)
      .lean();
    console.log(posts.length);
    return Promise.all(posts.map((post) => this.addPostDetails(post)));
  }

  async findByUser(userId: string): Promise<Post[]> {
    const posts = await this.postModel
      .find({ author: userId })
      .sort({ createdAt: -1 })
      .populate('author', 'username')
      .populate({
        path: 'sharedFrom',
        select: 'author title mediaUrls',
        populate: {
          path: 'author',
          select: 'username email',
        },
      })
      .lean();

    return Promise.all(posts.map((post) => this.addPostDetails(post)));
  }

  async findSharedByUser(userId: string): Promise<Post[]> {
    const posts = await this.postModel
      .find({ author: userId, sharedFrom: { $ne: null } })
      .sort({ createdAt: -1 })
      .populate('author', 'username')
      .populate({
        path: 'sharedFrom',
        select: 'author title mediaUrls',
        populate: {
          path: 'author',
          select: 'username email',
        },
      })
      .lean();

    return Promise.all(posts.map((post) => this.addPostDetails(post)));
  }
  async findById(id: string): Promise<Post | null> {
    const post = await this.postModel
      .findById(id)
      .populate('author', 'username')
      .populate('sharedFrom', 'author title mediaUrl')
      .lean();

    if (!post) return null;

    return this.addPostDetails(post);
  }
  async updatePost(id: string, updateData: any, userId: string) {
    const post = await this.postModel.findById(id);
    console.log('POST', post);
    if (!post) throw new NotFoundException('Post not found');
    if (post.author.toString() !== userId) {
      throw new ForbiddenException('Unauthorized');
    }
    console.log(updateData);

    if (updateData.title) post.title = updateData.title;
    if (updateData.description) post.description = updateData.description;
    if (updateData.mediaUrl) post.mediaUrl = updateData.mediaUrl;

    return post.save();
  }
  async deletePost(id: string, userId: string) {
    const post = await this.postModel.findById(id);
    console.log('POST', post);
    if (!post) throw new NotFoundException('Post not found');
    if (post.author.toString() !== userId)
      throw new ForbiddenException('Unauthorized');

    await post.deleteOne();
    return { message: 'Post deleted successfully' };
  }
}
