import { Model } from 'mongoose';
import { Reaction, ReactionDocument, ReactionType } from './reaction.schema';
export declare class ReactionService {
    private reactionModel;
    constructor(reactionModel: Model<ReactionDocument>);
    addOrUpdateReaction(userId: string, postId: string, type: ReactionType): Promise<(import("mongoose").Document<unknown, {}, ReactionDocument, {}> & Reaction & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
    getReactionsByPost(postId: string): Promise<{
        reactions: (import("mongoose").Document<unknown, {}, ReactionDocument, {}> & Reaction & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        })[];
        total: number;
        summary: Record<ReactionType, number>;
    }>;
}
