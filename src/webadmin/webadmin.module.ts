import { Module } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { WebadminService } from './webadmin.service';
import { Commons } from "../commons/commons";
import { CurrentConsoleLog,
        CurrentConsoleSend,
} from "./components";
import { RecordLog } from "./entities/record-log.entity";
import { WhModule } from "../wh/wh.module";
import { SkipLogs } from "../discord-bot/entities";

@Module({
  controllers: [],
  imports:[
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([
      RecordLog,
      SkipLogs,
    ]),
    WhModule
  ],
  providers: [
    WebadminService,
    Commons,
    CurrentConsoleLog,
    CurrentConsoleSend,
  ],
  exports: [
    WebadminService,
  ]
})
export class WebadminModule {}
