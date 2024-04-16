import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";

import { DiscordBotService } from './discord-bot.service';
import { DiscordBotController } from './discord-bot.controller';
import { Server } from "./entities/server.entity";
import { Member } from "./entities/member.entity";
import { Channel } from "./entities/channel.entity";
import { Moderator } from "./entities/moderator.entity";
import { Role } from "./entities/role.entity";
import { WebadminModule } from "../webadmin/webadmin.module";
import {
  ChannelService,
  KfService,
  MemberService,
  ModeratorService,
  RoleService,
  WebhookService
} from "./services";
import { ModalComponent } from "./components/modal.component";
import { Commons } from "../commons/commons";

@Module({
  controllers: [DiscordBotController],
  imports: [
    TypeOrmModule.forFeature([
      Server,
      Member,
      Channel,
      Moderator,
      Role,
    ]),
    WebadminModule,
  ],
  providers: [
    DiscordBotService,
    ChannelService,
    KfService,
    MemberService,
    ModeratorService,
    WebhookService,
    RoleService,
    ModalComponent,
    Commons
  ],
})
export class DiscordBotModule {}
