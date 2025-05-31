import { Post, PostDocument } from './post.schema';
import { Model } from 'mongoose';
import { Reaction } from 'src/reactions/reaction.schema';
export declare class PostsService {
    private postModel;
    private commentModel;
    private reactionModel;
    constructor(postModel: Model<PostDocument>, commentModel: Model<Comment>, reactionModel: Model<Reaction>);
    create(postData: Partial<Post>): Promise<Post>;
    private addPostDetails;
    findAll(page?: number, limit?: number): Promise<Post[]>;
    findByUser(userId: string): Promise<Post[]>;
    findSharedByUser(userId: string): Promise<Post[]>;
    findById(id: string): Promise<Post | null>;
    updatePost(id: string, updateData: any, userId: string): Promise<import("mongoose").Document<unknown, {}, PostDocument, {}> & Post & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    deletePost(id: string, userId: string): Promise<{
        message: string;
    }>;
}
