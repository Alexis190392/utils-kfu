import { Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";

import * as process from "process";
import axios from "axios";
import * as iconv from 'iconv-lite';

import { Commons } from "../commons/commons";

@Injectable()
export class WebadminService {

  private readonly baseUrl = `http://${process.env.WEBADMIN_URI}:${process.env.WEBADMIN_PORT}${process.env.DEFAULT_ENDPOINT}`;
  private readonly userAdmin = process.env.WEBADMIN_USER;
  private readonly password = process.env.WEBADMIN_PASS;

  private cache: string[] = [];
  constructor(
    private readonly commons:Commons
  ) {
  }

  async getConnection(){

    const url = this.baseUrl;
    const credentials = this.commons.encodeToBase64(`${this.userAdmin}:${this.password}`);

    const headers = {
      'Authorization': `Basic ${credentials}`,
    };

    try {
      const response = await axios.get(url, { headers });

      // return response.data;
      if (response.status === 200){
        return true
      }

    } catch (error) {
      console.log(error)
      return false
    }

  }

  @Cron('*/5 * * * * *')
  async cronDataLogs(){
    let data= await this.dataLogs();
    const forLogs = await this.newMessages(data);
    console.log(forLogs);
    // return await this.newMessages(data)
    // return this.dataLogs();
  }

  async dataLogs(): Promise<string[]> {
    const url = `${this.baseUrl}/current_console_log`;
    axios.defaults.responseEncoding= 'utf8';
    const credentials = this.commons.encodeToBase64(`${this.userAdmin}:${this.password}`);

    const headers = {
      'Authorization': `Basic ${credentials}`,
    };

    try {

      const response = await axios.get(url, { headers, responseType: 'arraybuffer' });
      const decodedData = iconv.decode(response.data, 'iso-8859-1'); // Decode from iso-8859-1 to UTF-8
      const consoleLogHtml = decodedData.toString(); // Convert to string

      const startTag = '&gt;';
      const endTag = '<a name="END"></a>';
      const startIndex = consoleLogHtml.indexOf(startTag);
      const endIndex = consoleLogHtml.indexOf(endTag);
      let consoleLogText = ""
      if (startIndex !== -1 && endIndex !== -1) {
        consoleLogText = consoleLogHtml.substring(startIndex + startTag.length, endIndex).trim();
        consoleLogText = this.commons.decodeParams(consoleLogText);

      }
        return this.commons.splitLines(consoleLogText);
        //throw new Error('No se pudo encontrar el contenido de la consola en la respuesta HTML.');

    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async newMessages(messages: string[]) {
    let newMessages: string[] = [];

    if (this.cache.length === 0) {
      this.cache = [...messages];
      return [...messages];
    }

    let found = false;
    for (let i = 0; i < messages.length; i++) {
      if (!this.cache.includes(messages[i])) {
        found = true;
        newMessages.push(messages[i]);
      } else if (found) {
        break;
      }
    }

    if (found) {
      this.cache = [...messages];
    }

    return newMessages;
  }
}
