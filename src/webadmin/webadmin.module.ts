import { Module } from '@nestjs/common';
import { WebadminService } from './webadmin.service';
import { WebadminController } from './webadmin.controller';
import { Commons } from "../commons/commons";
import { ScheduleModule } from '@nestjs/schedule';
import { CurrentConsoleLog, WebadminConnect } from "./components";
import { ConfigModule } from "@nestjs/config";

@Module({
  controllers: [WebadminController],
  imports:[
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
  ],
  providers: [WebadminService, Commons, CurrentConsoleLog, WebadminConnect],
})
export class WebadminModule {}
