import { Module } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";
import * as process from "process";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DiscordModule } from "nestjs-discord-webhook";
import { NecordModule } from "necord";
import { IntentsBitField } from "discord.js";
import { ScheduleModule } from "@nestjs/schedule";
import { DiscordBotModule } from './discord-bot/discord-bot.module';


@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      // host: process.env.DB_HOST,
      // port: +process.env.DB_PORT,
      // database: process.env.DB_NAME,
      // username: process.env.DB_USERNAME,
      // password: process.env.DB_PASSWORD,
      url: process.env.DB_URL,
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
    DiscordBotModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
  ],
})
export class AppModule {}
