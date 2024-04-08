import { Module } from '@nestjs/common';
import { DcService } from './dc.service';
import { DcController } from './dc.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Channel, Dc, Member, Role, Webhook } from "./entities";

@Module({
  controllers: [DcController],
  providers: [DcService],
  imports: [
    TypeOrmModule.forFeature([
      Dc,
      Member,
      Role,
      Webhook,
      Channel,
    ])
  ]
})
export class DcModule {}
