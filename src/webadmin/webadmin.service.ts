import { Injectable, Logger } from "@nestjs/common";
import {
  CurrentConsoleLog,
  CurrentConsoleSend,
} from "./components";

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

        return message;
        // await this.webhooks.sendMessage(message);
      }
    } catch (error) {
      this.logger.error(`Error en cronDataLogs: ${error.message}`);
    }
  }

  async sendToGame(sendText: string, baseUrl: string, credentials:string) {

    return this.currentConsoleSend.sendMessage(sendText, baseUrl, '/current_console', credentials);
  }


  //TODO ver todo lo de abajo

  // async getConnection(baseUrl:string, credentials:string) {
  //   try {
  //     return await this.webadminConnect.getConnection(baseUrl, credentials);
  //   } catch (error) {
  //     this.logger.error(`Error en getConnection: ${error.message}`, error.stack);
  //     throw error;
  //   }
  // }
  //
  // async dataLogs(baseUrl:string, consoleEndpoint:string, credentials:string) {
  //   try {
  //     return await this.currentConsoleLog.dataLogs(baseUrl, consoleEndpoint, credentials);
  //   } catch (error) {
  //     this.logger.error(`Error in dataLogs: ${error.message}`, error.stack);
  //     throw error;
  //   }
  // }


}
