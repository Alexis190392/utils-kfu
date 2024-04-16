import { Injectable, Logger } from "@nestjs/common";
import {
  CurrentConsoleLog,
  CurrentConsoleSend
} from "./components";
import axios from "axios";

@Injectable()
export class WebadminService {
  private readonly logger = new Logger("WebAdminService");
  constructor(
    private readonly currentConsoleLog: CurrentConsoleLog,
    private readonly currentConsoleSend: CurrentConsoleSend,
  ) {}


  async cronDataLogs(baseUrl:string, credentials:string , webhookId: String) {
    try {
      const data = await this.currentConsoleLog.dataLogs(baseUrl,'/current_console_log', credentials);
      const forLogs = await this.currentConsoleLog.newMessages(data);

      if (forLogs.length > 0){
        let message = '';
        for (const forLog of forLogs) {
          if (forLog != ''){
            message = `${message}\n${forLog}`
          }
        }
        // await this.webhooks.sendMessage(message);
      }
      return  'OK';
    } catch (error) {
      this.logger.error(`Error en cronDataLogs: ${error.message}`);
      return error.code;
    }
  }

  async sendToGame(sendText: string, baseUrl: string, credentials:string) {

    return this.currentConsoleSend.sendMessage(sendText, baseUrl, '/current_console', credentials);
  }


  //TODO ver todo lo de abajo

  async getConnection(baseUrl:string, credentials:string) {
    try {

      const headers = {
        'Authorization': `Basic ${credentials}`,
      };
      const response = await axios.get(baseUrl, { headers });

      return 'OK';

    } catch (error) {
      return error.code;
    }
  }

}
