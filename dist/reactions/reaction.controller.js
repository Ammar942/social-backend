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
exports.ReactionController = void 0;
const common_1 = require("@nestjs/common");
const reaction_service_1 = require("./reaction.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const response_helper_1 = require("../common/helper/response.helper");
const created_reaction_dto_1 = require("./dto/created-reaction.dto");
let ReactionController = class ReactionController {
    reactionService;
    constructor(reactionService) {
        this.reactionService = reactionService;
    }
    async react(postId, createdReactionDto, req) {
        const reaction = await this.reactionService.addOrUpdateReaction(req.user.userId, postId, createdReactionDto.type);
        return response_helper_1.ResponseHelper.success(reaction, 'Reaction added successfully');
    }
    async getSummary(postId) {
        const reactions = await this.reactionService.getReactionsByPost(postId);
        return response_helper_1.ResponseHelper.success(reactions, 'Reactions fetched successfully');
    }
};
exports.ReactionController = ReactionController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Param)('postId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, created_reaction_dto_1.CreatedReactionDto, Object]),
    __metadata("design:returntype", Promise)
], ReactionController.prototype, "react", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Param)('postId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReactionController.prototype, "getSummary", null);
exports.ReactionController = ReactionController = __decorate([
    (0, common_1.Controller)('posts/:postId/reactions'),
    __metadata("design:paramtypes", [reaction_service_1.ReactionService])
], ReactionController);
//# sourceMappingURL=reaction.controller.js.map