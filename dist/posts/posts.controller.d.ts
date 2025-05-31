import { PostsService } from './posts.service';
import { S3Service } from '../common/s3/s3.service';
import { CreatePostDto } from './dto/create-post.dto';
export declare class PostsController {
    private readonly postsService;
    private readonly s3Service;
    constructor(postsService: PostsService, s3Service: S3Service);
    createPost(file: Express.Multer.File, createPostDto: CreatePostDto, req: any): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    getUserPosts(req: any): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    getAllPosts(page?: number, limit?: number): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    getPost(id: string): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    updatePost(file: Express.Multer.File, id: string, updateData: any, req: any): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    deletePost(id: string, req: any): Promise<{
        message: string;
    }>;
    sharePost(id: string, body: any, req: any): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
}
