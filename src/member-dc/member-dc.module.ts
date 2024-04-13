import { Module } from '@nestjs/common';
import { MemberDcService } from './member-dc.service';
import { MemberDcController } from './member-dc.controller';

@Module({
  controllers: [MemberDcController],
  providers: [MemberDcService],
})
export class MemberDcModule {}
