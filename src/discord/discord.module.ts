import { Module } from '@nestjs/common';
import { ScheduleModule } from "@nestjs/schedule";
import { ConfigModule } from "@nestjs/config";

import * as process from "process";
import { DiscordModule } from "nestjs-discord-webhook";
import { NecordModule } from "necord";
import { IntentsBitField } from "discord.js";

import { DiscordService } from './discord.service';
import { DiscordController } from './discord.controller';
import { SlashCommands } from "./discord.slash";
import { DiscordUtils } from "./discord.utils";
import { StringSelectMenu } from "./components";
import { DiscordWebhooks } from "./discord.webhooks";
import { WebadminModule } from "../webadmin/webadmin.module";
import { Commons } from "../commons/commons";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Channel, Dc, Member, Role, Webhook } from "../dc/entities";

@Module({
  controllers: [DiscordController],
  imports:[
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    DiscordModule.forRoot({
      url: process.env.WEBHOOK_LOGS_URL, // ref:
    }),
    NecordModule.forRoot({
      token: process.env.DISCORD_TOKEN,
      intents:[
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.DirectMessages,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildIntegrations
      ],
    }),
    WebadminModule,
    //posible eliminar
    TypeOrmModule.forFeature([
      Dc,
      Member,
      Role,
      Webhook,
      Channel,
    ])

  ],
  providers: [
    DiscordService,
    SlashCommands,
    DiscordUtils,
    StringSelectMenu,
    DiscordWebhooks,
    Commons,
  ],
  exports:[DiscordService,]
})
export class DcordModule {}
