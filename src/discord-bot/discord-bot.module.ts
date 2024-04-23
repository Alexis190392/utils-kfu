import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";

import { DiscordBotService } from './discord-bot.service';
import { DiscordBotController } from './discord-bot.controller';

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
import { DiscordBotSlash } from "./discord-bot.slash";
import { RecordLog } from "../webadmin/entities/record-log.entity";
import {
  Channel,
  Member,
  Moderator,
  Role,
  Server, SkipLogs, Status
} from "./entities";

@Module({
  controllers: [DiscordBotController],
  imports: [
    TypeOrmModule.forFeature([
      Server,
      Member,
      Channel,
      Moderator,
      Role,
      Status,
      RecordLog,
      SkipLogs,
    ]),
    WebadminModule,
  ],
  providers: [
    DiscordBotService,
    DiscordBotSlash,
    ChannelService,
    KfService,
    MemberService,
    ModeratorService,
    WebhookService,
    RoleService,
    ModalComponent,
    Commons
  ],
  exports:[
    WebhookService,
  ]
})
export class DiscordBotModule {}
