import { Module } from '@nestjs/common';
import { ModeratorDcService } from './moderator-dc.service';
import { ModeratorDcController } from './moderator-dc.controller';
import { WebadminService } from "../webadmin/webadmin.service";
import { DcService } from "../dc/dc.service";
import { DcUtils } from "../dc/dc.utils";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Moderator } from "./entities/moderator.entity";
import { CurrentConsoleLog, CurrentConsoleSend, WebadminConnect } from "../webadmin/components";
import { Commons } from "../commons/commons";
import { WebhookDcService } from "../webhook-dc/webhook-dc.service";
import { Member } from "../member-dc/entities/member.entity";

@Module({
  controllers: [ModeratorDcController],
  imports: [
    TypeOrmModule.forFeature([
      Moderator,
      Member,
    ])
  ],
  providers: [
    ModeratorDcService,
    WebadminService,
    DcService,
    DcUtils,
    WebadminConnect,
    CurrentConsoleLog,
    CurrentConsoleSend,
    Commons,
    WebhookDcService,
  ],
})
export class ModeratorDcModule {}
