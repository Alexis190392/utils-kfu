import { Module } from '@nestjs/common';
import { WhService } from './wh.service';

@Module({
  controllers: [],
  providers: [WhService],
  exports:[WhService]
})
export class WhModule {}
