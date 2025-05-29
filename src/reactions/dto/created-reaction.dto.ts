import { ReactionType } from '../reaction.schema';
import { IsEnum } from 'class-validator';
export class CreatedReactionDto {
  @IsEnum(ReactionType)
  type: ReactionType;
}
