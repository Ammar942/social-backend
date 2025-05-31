import { Document } from 'mongoose';
import mongoose from 'mongoose';
export type CommentDocument = Comment & Document;
export declare class Comment {
    text: string;
    author: mongoose.Types.ObjectId;
    post: mongoose.Types.ObjectId;
}
export declare const CommentSchema: mongoose.Schema<Comment, mongoose.Model<Comment, any, any, any, Document<unknown, any, Comment, any> & Comment & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Comment, Document<unknown, {}, mongoose.FlatRecord<Comment>, {}> & mongoose.FlatRecord<Comment> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
