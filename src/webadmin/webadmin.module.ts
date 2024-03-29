import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from "@nestjs/config";

import { WebadminService } from './webadmin.service';
import { WebadminController } from './webadmin.controller';
import { Commons } from "../commons/commons";
import { CurrentConsoleLog,
        CurrentConsoleSend,
        WebadminConnect } from "./components";
import { DiscordWebhooks } from "../discord/discord.webhooks";


@Module({
  controllers: [WebadminController],
  imports:[
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
  ],
  providers: [
    WebadminService,
    Commons,
    CurrentConsoleLog,
    WebadminConnect,
    CurrentConsoleSend,
    DiscordWebhooks,
  ],
  exports: [
    WebadminService,
    WebadminConnect,
    CurrentConsoleLog,
    CurrentConsoleSend
  ]
})
export class WebadminModule {}
