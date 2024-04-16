import { Module } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";

import { WebadminService } from './webadmin.service';
import { WebadminController } from './webadmin.controller';
import { Commons } from "../commons/commons";
import { CurrentConsoleLog,
        CurrentConsoleSend,
        WebadminConnect,
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
    WebadminConnect,
    CurrentConsoleSend,
  ],
  exports: [
    WebadminService,
    // WebadminConnect,
    // CurrentConsoleLog,
    // CurrentConsoleSend,
  ]
})
export class WebadminModule {}
