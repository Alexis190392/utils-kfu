import { Module } from '@nestjs/common';
import { WebadminService } from './webadmin.service';
import { WebadminController } from './webadmin.controller';
import { Commons } from "../commons/commons";

@Module({
  controllers: [WebadminController],
  providers: [WebadminService, Commons],
})
export class WebadminModule {}
