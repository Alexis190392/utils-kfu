import { Module } from '@nestjs/common';
import { WhService } from './wh.service';
import { WhController } from './wh.controller';

@Module({
  controllers: [WhController],
  providers: [WhService],
  exports:[WhService]
})
export class WhModule {}
