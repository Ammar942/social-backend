import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
export declare class CommentController {
    private readonly commentService;
    constructor(commentService: CommentService);
    createComment(postId: string, createCommentDto: CreateCommentDto, req: any): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    getComments(postId: string): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    updateComment(id: string, body: CreateCommentDto): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    deleteComment(id: string): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
}
