import { Module } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";

import { WebadminService } from './webadmin.service';
import { WebadminController } from './webadmin.controller';
import { Commons } from "../commons/commons";
import { CurrentConsoleLog,
        CurrentConsoleSend,
} from "./components";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RecordLog } from "./entities/record-log.entity";
import { WhModule } from "../wh/wh.module";


@Module({
  controllers: [WebadminController],
  imports:[
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([
      RecordLog,
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
