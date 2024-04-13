import { Injectable, Logger } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import * as process from "process";
import { Commons } from "../commons/commons";
import {
  CurrentConsoleLog,
  CurrentConsoleSend,
  WebadminConnect
} from "./components";
import { WebhookDcService } from "../webhook-dc/webhook-dc.service";


@Injectable()
export class WebadminService {
  private readonly logger = new Logger(WebadminService.name);

  private readonly baseUrl = `http://${process.env.WEBADMIN_URI}:${process.env.WEBADMIN_PORT}${process.env.DEFAULT_ENDPOINT}`;
  private readonly credentials = this.commons.encodeToBase64(`${process.env.WEBADMIN_USER}:${process.env.WEBADMIN_PASS}`);
  private readonly consoleEndpoint = process.env.CURRENT_CONSOLE_LOG;
  private readonly consoleSend = process.env.CURRENT_CONSOLE_SEND;

  constructor(
    private readonly webadminConnect: WebadminConnect,
    private readonly commons: Commons,
    private readonly currentConsoleLog: CurrentConsoleLog,
    private readonly currentConsoleSend: CurrentConsoleSend,
    private readonly webhooks: WebhookDcService,
  ) {}

  @Cron('*/5 * * * * *')
  async cronDataLogs() {
    try {
      const data = await this.currentConsoleLog.dataLogs(this.baseUrl, this.consoleEndpoint, this.credentials);
      const forLogs = await this.currentConsoleLog.newMessages(data);

      if (forLogs.length > 0){
        let message = '';
        for (const forLog of forLogs) {
          if (forLog != ''){
            message = `${message}\n${forLog}`
          }
        }
        await this.webhooks.sendMessage(message);
      }
    } catch (error) {
      this.logger.error(`Error en cronDataLogs: ${error.message}`);
    }
  }

  async getConnection() {
    try {
      return await this.webadminConnect.getConnection(this.baseUrl, this.credentials);
    } catch (error) {
      this.logger.error(`Error en getConnection: ${error.message}`, error.stack);
      throw error;
    }
  }

  async dataLogs() {
    try {
      return await this.currentConsoleLog.dataLogs(this.baseUrl, this.consoleEndpoint, this.credentials);
    } catch (error) {
      this.logger.error(`Error in dataLogs: ${error.message}`, error.stack);
      throw error;
    }
  }

  async sendMessage(sendText: string) {
    return this.currentConsoleSend.sendMessage(sendText, this.baseUrl, this.consoleSend, this.credentials);
  }
}
