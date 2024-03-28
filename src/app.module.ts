import { Module } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Commons } from './commons/commons';
import { WebadminModule } from './webadmin/webadmin.module';
import { DCModule } from "./discord/discord.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    WebadminModule,
    DCModule,
  ],
  controllers: [AppController],
  providers: [AppService, Commons],
})
export class AppModule {}
