import { Module } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Commons } from './commons/commons';
import { DcordModule } from "./discord/discord.module";
import { ServerModule } from './server/server.module';
import { TypeOrmModule } from "@nestjs/typeorm";
import { DcModule } from './dc/dc.module';
import * as process from "process";

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true, //en prod va en false

    }),
    DcordModule,
    ServerModule,
    DcModule,
  ],
  controllers: [AppController],
  providers: [AppService, Commons],
})
export class AppModule {}
