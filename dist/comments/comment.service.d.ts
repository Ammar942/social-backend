import { Comment, CommentDocument } from './comment.schema';
import { Model } from 'mongoose';
export declare class CommentService {
    private commentModel;
    constructor(commentModel: Model<CommentDocument>);
    create(text: string, userId: string, postId: string): Promise<Comment>;
    findByPost(postId: string): Promise<Comment[]>;
    update(id: string, text: string): Promise<Comment>;
    delete(id: string): Promise<void>;
}
