import { Module } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";
import * as process from "process";
import { ScheduleModule } from "@nestjs/schedule";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NecordModule } from "necord";
import { DiscordModule } from "nestjs-discord-webhook";
import { IntentsBitField } from "discord.js";

import { Commons } from "../commons/commons";
import { Channel, Dc, Member, Moderator, Role } from "./entities";
import { Embeds, Modals, StringSelectMenu } from "./components";
import { WebadminModule } from "../webadmin/webadmin.module";
import { ServerModule } from "../server/server.module";
import { Server } from "../server/entities/server.entity";
import { ServerService } from "../server/server.service";
import { DcService } from './dc.service';
import { DcController } from './dc.controller';
import { SlashCommands } from "./dc.slash";
import { DcUtils } from "./dc.utils";
import { ChannelService, ServerServiceDc, WebhooksService } from "./services";


@Module({
  controllers: [DcController],
  imports:[
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    DiscordModule.forRoot({
      url: process.env.WEBHOOK_LOGS_URL,
    }),
    NecordModule.forRoot({
      token: process.env.DISCORD_TOKEN,
      intents:[
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.DirectMessages,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildIntegrations,
        IntentsBitField.Flags.GuildMembers
      ],
    }),
    WebadminModule,
    ServerModule,
    //posible eliminar
    TypeOrmModule.forFeature([
      Dc,
      Member,
      Role,
      Channel,
      Server,
      Moderator,
    ])
  ],
  providers: [
    DcService,
    ServerServiceDc,
    ChannelService,
    SlashCommands,
    DcUtils,
    ServerService,
    StringSelectMenu,
    Modals,
    Embeds,
    WebhooksService,
    Commons,
  ],
  exports:[DcService,]
})
export class DcModule {}
