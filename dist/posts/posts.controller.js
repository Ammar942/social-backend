"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const posts_service_1 = require("./posts.service");
const s3_service_1 = require("../common/s3/s3.service");
const post_schema_1 = require("./post.schema");
const mime = require("mime-types");
const mongoose_1 = require("mongoose");
const response_helper_1 = require("../common/helper/response.helper");
const create_post_dto_1 = require("./dto/create-post.dto");
let PostsController = class PostsController {
    postsService;
    s3Service;
    constructor(postsService, s3Service) {
        this.postsService = postsService;
        this.s3Service = s3Service;
    }
    async createPost(file, createPostDto, req) {
        if (!file)
            throw new common_1.BadRequestException('No media file provided');
        console.log(createPostDto);
        const mediaUrl = await this.s3Service.uploadFile(file);
        const type = mime.lookup(file.originalname)?.startsWith('video')
            ? post_schema_1.MediaType.VIDEO
            : post_schema_1.MediaType.IMAGE;
        const post = await this.postsService.create({
            title: createPostDto.title,
            description: createPostDto.description,
            mediaUrl,
            mediaType: type,
            author: req.user.userId,
        });
        return response_helper_1.ResponseHelper.success(post, 'Post created successfully');
    }
    async getUserPosts(req) {
        const userId = req.user.userId;
        const original = await this.postsService.findByUser(userId);
        const shared = await this.postsService.findSharedByUser(userId);
        return response_helper_1.ResponseHelper.success({
            originalPosts: original.filter((p) => !p.sharedFrom),
            sharedPosts: shared,
        }, 'Posts fetched successfully');
    }
    async getAllPosts(page = 1, limit = 10) {
        const posts = await this.postsService.findAll(page, limit);
        return response_helper_1.ResponseHelper.success(posts, 'Posts fetched successfully');
    }
    async getPost(id) {
        const post = await this.postsService.findById(id);
        console.log(post);
        return response_helper_1.ResponseHelper.success(post, 'Post fetched successfully');
    }
    async updatePost(file, id, updateData, req) {
        const userId = req.user?.userId;
        let mediaUrl;
        let mediaType;
        if (file) {
            mediaUrl = await this.s3Service.uploadFile(file);
            mediaType = mime.lookup(file.originalname)?.startsWith('video')
                ? post_schema_1.MediaType.VIDEO
                : post_schema_1.MediaType.IMAGE;
            updateData.mediaUrl = mediaUrl;
            updateData.mediaType = mediaType;
        }
        const updatedPost = await this.postsService.updatePost(id, updateData, userId);
        return response_helper_1.ResponseHelper.success(updatedPost, 'Post updated successfully');
    }
    async deletePost(id, req) {
        const userId = req.user?.userId;
        return this.postsService.deletePost(id, userId);
    }
    async sharePost(id, body, req) {
        const originalPost = (await this.postsService.findById(id));
        if (!originalPost) {
            throw new common_1.NotFoundException('Original post not found');
        }
        console.log(originalPost);
        console.log(body);
        const sharedPost = await this.postsService.create({
            title: body?.title || originalPost.title,
            description: body?.description || originalPost.description,
            mediaUrl: originalPost.mediaUrl,
            mediaType: originalPost.mediaType,
            author: req.user.userId,
            sharedFrom: mongoose_1.Types.ObjectId.createFromHexString(originalPost._id.toString()),
        });
        return response_helper_1.ResponseHelper.success(sharedPost, 'Shared Post fetched successfully');
    }
};
exports.PostsController = PostsController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('create'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('media')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_post_dto_1.CreatePostDto, Object]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "createPost", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('/profile'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "getUserPosts", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "getAllPosts", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "getPost", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('media')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object, Object]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "updatePost", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "deletePost", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(':id/share'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PostsController.prototype, "sharePost", null);
exports.PostsController = PostsController = __decorate([
    (0, common_1.Controller)('posts'),
    __metadata("design:paramtypes", [posts_service_1.PostsService,
        s3_service_1.S3Service])
], PostsController);
//# sourceMappingURL=posts.controller.js.map