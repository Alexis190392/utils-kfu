import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import axios from "axios";

import {
  CurrentConsoleLog,
  CurrentConsoleSend} from "./components";
import { RecordLog } from "./entities/record-log.entity";

@Injectable()
export class WebadminService {
  private readonly logger = new Logger("WebAdminService");
  constructor(
    private readonly currentConsoleLog: CurrentConsoleLog,
    private readonly currentConsoleSend: CurrentConsoleSend,

    @InjectRepository(RecordLog)
    private readonly recordLogRepository : Repository<RecordLog>,
  ) {}

  async cronDataLogs(baseUrl:string, credentials:string, channelId: string, webhookId: string) {
    try {
      const data = await this.currentConsoleLog.dataLogs(baseUrl,'/current_console_log', credentials, webhookId);
      if (data) {
        let message = "";
        let saveRecord: RecordLog;

        if (data.length > 0) {

          for (const forLog of data) {
            if (forLog != "") {
              message = `${message}\n${forLog}`;

              const record = new RecordLog();
              record.logs = message;
              record.channelId = channelId;
              record.webhookId = webhookId;
              record.date = new Date();

              saveRecord = this.recordLogRepository.create(record);
            }
          }
          if (saveRecord)
            await this.recordLogRepository.save(saveRecord);
        }
      }
      return 200;
    } catch (error) {
      this.logger.error(error.message);
      return 502;
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
      return 404;
    }
  }

}
