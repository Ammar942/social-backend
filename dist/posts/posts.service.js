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
exports.PostsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const post_schema_1 = require("./post.schema");
const mongoose_2 = require("mongoose");
let PostsService = class PostsService {
    postModel;
    commentModel;
    reactionModel;
    constructor(postModel, commentModel, reactionModel) {
        this.postModel = postModel;
        this.commentModel = commentModel;
        this.reactionModel = reactionModel;
    }
    async create(postData) {
        const newPost = new this.postModel(postData);
        return newPost.save();
    }
    async addPostDetails(post) {
        const postId = post._id;
        const comments = await this.commentModel
            .find({ post: postId })
            .populate('author', 'username')
            .sort({ createdAt: 1 })
            .lean();
        const reactions = await this.reactionModel.find({ post: postId }).lean();
        const reactionSummary = reactions.reduce((acc, r) => {
            acc[r.type] = (acc[r.type] || 0) + 1;
            return acc;
        }, {});
        console.log(reactions);
        return {
            ...post,
            comments,
            reactions: {
                reactions,
                total: reactions.length,
                summary: reactionSummary,
            },
        };
    }
    async findAll(page = 1, limit = 10) {
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
    async findByUser(userId) {
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
    async findSharedByUser(userId) {
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
    async findById(id) {
        const post = await this.postModel
            .findById(id)
            .populate('author', 'username')
            .populate('sharedFrom', 'author title mediaUrl')
            .lean();
        if (!post)
            return null;
        return this.addPostDetails(post);
    }
    async updatePost(id, updateData, userId) {
        const post = await this.postModel.findById(id);
        console.log('POST', post);
        if (!post)
            throw new common_1.NotFoundException('Post not found');
        if (post.author.toString() !== userId) {
            throw new common_1.ForbiddenException('Unauthorized');
        }
        console.log(updateData);
        if (updateData.title)
            post.title = updateData.title;
        if (updateData.description)
            post.description = updateData.description;
        if (updateData.mediaUrl)
            post.mediaUrl = updateData.mediaUrl;
        return post.save();
    }
    async deletePost(id, userId) {
        const post = await this.postModel.findById(id);
        console.log('POST', post);
        if (!post)
            throw new common_1.NotFoundException('Post not found');
        if (post.author.toString() !== userId)
            throw new common_1.ForbiddenException('Unauthorized');
        await post.deleteOne();
        return { message: 'Post deleted successfully' };
    }
};
exports.PostsService = PostsService;
exports.PostsService = PostsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(post_schema_1.Post.name)),
    __param(1, (0, mongoose_1.InjectModel)('Comment')),
    __param(2, (0, mongoose_1.InjectModel)('Reaction')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], PostsService);
//# sourceMappingURL=posts.service.js.map