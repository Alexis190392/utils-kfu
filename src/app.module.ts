import { Module } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";
import * as process from "process";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Commons } from './commons/commons';
import { ServerModule } from './server/server.module';
import { DcModule } from './dc/dc.module';
import { ChannelDcModule } from './channel-dc/channel-dc.module';
import { WebhookDcModule } from './webhook-dc/webhook-dc.module';
import { ModeratorDcModule } from './moderator-dc/moderator-dc.module';
import { MemberDcModule } from './member-dc/member-dc.module';
import { DiscordModule } from "nestjs-discord-webhook";
import { NecordModule } from "necord";
import { IntentsBitField } from "discord.js";


@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true, //en prod va en false
    }),
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
    ServerModule,
    DcModule,
    ChannelDcModule,
    WebhookDcModule,
    ModeratorDcModule,
    MemberDcModule,
  ],
  controllers: [AppController],
  providers: [AppService, Commons],
})
export class AppModule {}
