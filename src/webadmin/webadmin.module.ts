import { Module } from '@nestjs/common';
import { WebadminService } from './webadmin.service';
import { WebadminController } from './webadmin.controller';
import { Commons } from "../commons/commons";
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  controllers: [WebadminController],
  imports:[
    ScheduleModule.forRoot(),
  ],
  providers: [WebadminService, Commons],
})
export class WebadminModule {}
