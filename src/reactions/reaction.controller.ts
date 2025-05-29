import {
  Controller,
  Post,
  Param,
  Body,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ReactionService } from './reaction.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ResponseHelper } from 'src/common/helper/response.helper';
import { CreatedReactionDto } from './dto/created-reaction.dto';
// import { ReactionType } from './reaction.schema';

@Controller('posts/:postId/reactions')
export class ReactionController {
  constructor(private readonly reactionService: ReactionService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async react(
    @Param('postId') postId: string,
    @Body() createdReactionDto: CreatedReactionDto,
    @Request() req,
  ) {
    const reaction = await this.reactionService.addOrUpdateReaction(
      req.user.userId,
      postId,
      createdReactionDto.type,
    );
    return ResponseHelper.success(reaction, 'Reaction added successfully');
    // return this.reactionService.addOrUpdateReaction(
    //   req.user.userId,
    //   postId,
    //   type,
    // );
  }
  @Get()
  async getSummary(@Param('postId') postId: string) {
    const reactions = await this.reactionService.getReactionsByPost(postId);
    return ResponseHelper.success(reactions, 'Reactions fetched successfully');
    // return this.reactionService.getReactionsByPost(postId);
  }
}
// @Patch('')
// @UseGuards(JwtAuthGuard)
// async toggleReaction(
//   @Param('postId') postId: string,
//   @Body('type') type: ReactionType,
//   @Req() req,
// ) {
//   console.log(type);
//   return this.reactionService.toggleReaction(postId, type, req.user.userId);
// }
