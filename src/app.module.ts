import { Module } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";

import * as process from "process";
import { NecordModule } from "necord";
import { IntentsBitField } from "discord.js";

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Commons } from './commons/commons';
import { WebadminModule } from './webadmin/webadmin.module';
import { DiscordModule } from './discord/discord.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    NecordModule.forRoot({
      token: process.env.DISCORD_TOKEN,
      intents:[IntentsBitField.Flags.Guilds]
    }),
    WebadminModule,
    DiscordModule,
  ],
  controllers: [AppController],
  providers: [AppService, Commons],
})
export class AppModule {}
