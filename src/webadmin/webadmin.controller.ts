import { Body, Controller, Get, Post } from "@nestjs/common";
import { WebadminService } from "./webadmin.service";

@Controller('webAdmin')
export class WebadminController {
  constructor(private readonly webadminService: WebadminService) {}

  // @Get('/status')
  // getStatus(){
  //   return this.webadminService.getConnection();
  // }
  //
  // @Get('/dataLogs')
  // getDataLogs(){
  //   return this.webadminService.dataLogs();
  // }

  // @Post('/send')
  // async enviarPost(@Body('SendText') sendText: string) {
  //   try {
  //     const response = await this.webadminService.sendMessage(sendText);
  //     return {
  //       status: 'send data',
  //       data: response
  //     };
  //   } catch (error) {
  //     return {
  //       status: 'error',
  //       message: error.message
  //     };
  //   }
  // }

}
