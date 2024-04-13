import { Module } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";
import * as process from "process";
import { ScheduleModule } from "@nestjs/schedule";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NecordModule } from "necord";
import { DiscordModule } from "nestjs-discord-webhook";
import { IntentsBitField } from "discord.js";
import { DcController } from "./dc.controller";
import { WebadminModule } from "../webadmin/webadmin.module";
import { ServerModule } from "../server/server.module";
import { Server } from "../server/entities/server.entity";
import { DcService } from "./dc.service";

import { SlashCommands } from "./dc.slash";
import { DcUtils } from "./dc.utils";
import { ServerService } from "../server/server.service";
import { Modals, StringSelectMenu } from "./components";
import { Commons } from "../commons/commons";
import { Member } from "../member-dc/entities/member.entity";
import { WebhookDcService } from "../webhook-dc/webhook-dc.service";
import { ModeratorDcService } from "../moderator-dc/moderator-dc.service";
import { Moderator } from "../moderator-dc/entities/moderator.entity";
import { WebadminService } from "../webadmin/webadmin.service";
import { ModalComponent } from "../server/components/modal.component";

@Module({
  controllers: [DcController],
  imports:[
    // ConfigModule.forRoot(),
    // ScheduleModule.forRoot(),
    WebadminModule,
    // ServerModule,
    //posible eliminar
    TypeOrmModule.forFeature([
      Server,
      Member,
      Moderator,
    ])
  ],
  providers: [
    DcService,
    SlashCommands,
    DcUtils,
    ServerService,
    StringSelectMenu,
    Modals,
    Commons,
    WebhookDcService,
    ModeratorDcService,
    WebadminService,
    ModalComponent
  ],
  exports:[DcService,]
})
export class DcModule {}
