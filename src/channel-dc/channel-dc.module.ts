import { Module } from '@nestjs/common';
import { ChannelDcService } from './channel-dc.service';
import { ChannelDcController } from './channel-dc.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Channel } from "./entities/channel.entity";

@Module({
  controllers: [ChannelDcController],
  imports: [
    TypeOrmModule.forFeature([
      Channel,
    ])
  ],
  providers: [ChannelDcService],
})
export class ChannelDcModule {}
