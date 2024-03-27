import { Controller, Get } from '@nestjs/common';
import { WebadminService } from "./webadmin.service";

@Controller('webAdmin')
export class WebadminController {
  constructor(private readonly webadminService: WebadminService) {}

  @Get('/status')
  getStatus(){
    return this.webadminService.getConnection();
  }

  @Get('/dataLogs')
  getDataLogs(){
    return this.webadminService.dataLogs();
  }

}
