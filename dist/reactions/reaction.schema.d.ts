import mongoose, { Document } from 'mongoose';
export type ReactionDocument = Reaction & Document;
export declare enum ReactionType {
    LIKE = "like",
    LOVE = "love",
    FUNNY = "funny"
}
export declare class Reaction {
    user: mongoose.Types.ObjectId;
    post: mongoose.Types.ObjectId;
    type: ReactionType;
}
export declare const ReactionSchema: mongoose.Schema<Reaction, mongoose.Model<Reaction, any, any, any, mongoose.Document<unknown, any, Reaction, any> & Reaction & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Reaction, mongoose.Document<unknown, {}, mongoose.FlatRecord<Reaction>, {}> & mongoose.FlatRecord<Reaction> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
