import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Reaction, ReactionSchema } from './reaction.schema';
import { ReactionService } from './reaction.service';
import { ReactionController } from './reaction.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Reaction.name, schema: ReactionSchema },
    ]),
  ],
  providers: [ReactionService],
  controllers: [ReactionController],
  exports: [MongooseModule],
})
export class ReactionModule {}
