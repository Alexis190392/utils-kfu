import { Module } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";

import { WebadminService } from './webadmin.service';
import { WebadminController } from './webadmin.controller';
import { Commons } from "../commons/commons";
import { CurrentConsoleLog,
        CurrentConsoleSend,
} from "./components";


@Module({
  controllers: [WebadminController],
  imports:[
    ConfigModule.forRoot(),
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
