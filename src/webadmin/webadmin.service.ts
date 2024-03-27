import { Injectable, Logger } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { CurrentConsoleLog, WebadminConnect } from "./components";
import { ConfigService } from "@nestjs/config";
import * as process from "process";

@Injectable()
export class WebadminService {
  private readonly logger = new Logger(WebadminService.name);

  private readonly baseUrl = `http://${process.env.WEBADMIN_URI}:${process.env.WEBADMIN_PORT}${process.env.DEFAULT_ENDPOINT}`;
  private readonly userAdmin = process.env.WEBADMIN_USER;
  private readonly password = process.env.WEBADMIN_PASS;
  private readonly currentConsoleEndpoint = process.env.CURRENT_CONSOLE_LOG;

  constructor(
    private readonly currentConsoleLog: CurrentConsoleLog,
    private readonly webadminConnect: WebadminConnect,
  ) {}

  @Cron('*/5 * * * * *')
  async cronDataLogs() {
    try {
      const data = await this.currentConsoleLog.dataLogs(this.baseUrl, this.currentConsoleEndpoint, this.userAdmin, this.password);
      const forLogs = await this.currentConsoleLog.newMessages(data);
      console.log(forLogs);
      // return await this.newMessages(data)
      // return this.dataLogs();
    } catch (error) {
      this.logger.error(`Error en cronDataLogs: ${error.message}`);
    }
  }

  async getConnection() {
    try {
      return await this.webadminConnect.getConnection(this.baseUrl, this.userAdmin, this.password);
    } catch (error) {
      this.logger.error(`Error en getConnection: ${error.message}`, error.stack);
      throw error;
    }
  }

  async dataLogs() {
    try {
      return await this.currentConsoleLog.dataLogs(this.baseUrl, this.currentConsoleEndpoint, this.userAdmin, this.password);
    } catch (error) {
      this.logger.error(`Error in dataLogs: ${error.message}`, error.stack);
      throw error; // Re-lanza el error para que sea manejado en un nivel superior si es necesario.
    }
  }
}
