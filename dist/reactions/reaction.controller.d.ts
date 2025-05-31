import { ReactionService } from './reaction.service';
import { CreatedReactionDto } from './dto/created-reaction.dto';
export declare class ReactionController {
    private readonly reactionService;
    constructor(reactionService: ReactionService);
    react(postId: string, createdReactionDto: CreatedReactionDto, req: any): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    getSummary(postId: string): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
}
