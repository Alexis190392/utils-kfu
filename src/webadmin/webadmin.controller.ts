import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WebadminService } from './webadmin.service';
import { CreateWebadminDto } from './dto/create-webadmin.dto';
import { UpdateWebadminDto } from './dto/update-webadmin.dto';

@Controller('webAdmin')
export class WebadminController {
  constructor(private readonly webadminService: WebadminService) {}

  @Get('/status')
  getStatus(){
    return this.webadminService.getConnection();
  }


}
