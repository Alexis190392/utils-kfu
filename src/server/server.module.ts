import { Module } from '@nestjs/common';
import { ServerService } from './server.service';
import { ServerController } from './server.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Server } from "./entities/server.entity";

@Module({
  controllers: [ServerController],
  providers: [ServerService],
  imports: [
    TypeOrmModule.forFeature([Server])
  ]
})
export class ServerModule {}
