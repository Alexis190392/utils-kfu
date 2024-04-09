import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";

import { ServerService } from './server.service';
import { ServerController } from './server.controller';
import { Server } from "./entities/server.entity";

@Module({
  controllers: [ServerController],
  providers: [ServerService],
  imports: [
    TypeOrmModule.forFeature([Server])
  ]
})
export class ServerModule {}
