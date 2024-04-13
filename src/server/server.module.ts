import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";

import { ServerService } from './server.service';
import { ServerController } from './server.controller';
import { Server } from "./entities/server.entity";
import { ModalComponent } from "./components/modal.component";
import { ModeratorDcService } from "../moderator-dc/moderator-dc.service";
import { WebadminService } from "../webadmin/webadmin.service";
import { DcService } from "../dc/dc.service";
import { DcUtils } from "../dc/dc.utils";
import { Moderator } from "../moderator-dc/entities/moderator.entity";
import { CurrentConsoleLog, CurrentConsoleSend, WebadminConnect } from "../webadmin/components";
import { Commons } from "../commons/commons";
import { WebhookDcService } from "../webhook-dc/webhook-dc.service";
import { Member } from "../member-dc/entities/member.entity";
import { ChannelDcService } from "../channel-dc/channel-dc.service";

@Module({
  controllers: [ServerController],
  imports: [
    TypeOrmModule.forFeature([
      Server,
      Moderator,
      Member,
    ]),
  ],
  providers: [
    ServerService,
    ModalComponent,
    ModeratorDcService,
    WebadminService,
    DcService,
    DcUtils,
    WebadminConnect,
    Commons,
    CurrentConsoleLog,
    CurrentConsoleSend,
    WebhookDcService,
    ChannelDcService,

  ],
})
export class ServerModule {}
