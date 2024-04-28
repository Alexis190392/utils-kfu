import { Module } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";
import * as process from "process";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NecordModule } from "necord";
import { IntentsBitField } from "discord.js";
import { ScheduleModule } from "@nestjs/schedule";
import { DiscordBotModule } from './discord-bot/discord-bot.module';
import { WhModule } from './wh/wh.module';
import { TempVoiceModule } from './temp-voice/temp-voice.module';
import { BannerModule } from './banner/banner.module';


@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DB_URI,
      autoLoadEntities: true,
      synchronize: true, //en prod va en false
    }),
    NecordModule.forRoot({
      token: process.env.DISCORD_TOKEN,
      intents:[
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.DirectMessages,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildIntegrations,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildVoiceStates
      ],
    }),
    DiscordBotModule,
    WhModule,
    TempVoiceModule,
    BannerModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
  ],
})
export class AppModule {}
