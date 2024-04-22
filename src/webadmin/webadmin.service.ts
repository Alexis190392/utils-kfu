import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import axios from "axios";

import {
  CurrentConsoleLog,
  CurrentConsoleSend} from "./components";
import { RecordLog } from "./entities/record-log.entity";
import { Server } from "../discord-bot/entities";
import { Commons } from "../commons/commons";

@Injectable()
export class WebadminService {
  private readonly logger = new Logger("WebAdminService");
  constructor(
    private readonly currentConsoleLog: CurrentConsoleLog,
    private readonly currentConsoleSend: CurrentConsoleSend,
    private readonly commons:Commons,

    @InjectRepository(RecordLog)
    private readonly recordLogRepository : Repository<RecordLog>,
  ) {}

  async cronDataLogs(server:Server) {
    try {

      const baseUrl = `http://${server.ip}:${server.port}/ServerAdmin`;
      const credentials = this.commons.encodeToBase64(`${server.user}:${server.pass}`);

      const data = await this.currentConsoleLog.dataLogs(baseUrl,'/current_console_log', credentials, server);

      if (typeof data === 'number')
        return data;

      if (data.length === 0) {
        return 200;
      }

      if (data) {
        let message = "";
        let saveRecord: RecordLog;

        if (data.length > 0) {

          for (const forLog of data) {
            if (forLog != "") {
              message = `${message}\n${forLog}`;

              const record = new RecordLog();
              record.logs = message;
              record.channelId = server.channelId;
              record.webhookId = server.webhook;
              record.date = new Date();

              saveRecord = this.recordLogRepository.create(record);
            }
          }
          if (saveRecord)
            await this.recordLogRepository.save(saveRecord);
        }
        return 200;
      }
    } catch (error) {
      this.logger.error(error.message);
      return 404;
    }
  }

  async sendToGame(sendText: string, baseUrl: string, credentials:string) {
    return this.currentConsoleSend.sendMessage(sendText, baseUrl, credentials);
  }

  async getConnection(baseUrl:string, credentials:string) {
    try {

      const headers = {
        'Authorization': `Basic ${credentials}`,
      };
      const response = await axios.get(baseUrl, { headers });

      return response.status;

    } catch (error) {
      return error.code;
    }
  }

}
