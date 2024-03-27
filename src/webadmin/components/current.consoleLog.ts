import { Injectable } from "@nestjs/common";

import axios from "axios";
import * as iconv from "iconv-lite";

import { Commons } from "../../commons/commons";

@Injectable()
export class CurrentConsoleLog {

  private cache: string[] = [];

  constructor(
    private readonly commons:Commons
  ) {
  }

  async dataLogs(url: string, endpoint: string, userAdmin: string, password: string): Promise<string[]> {
    const credentials = this.commons.encodeToBase64(`${userAdmin}:${password}`);

    const headers = {
      'Authorization': `Basic ${credentials}`,
    };

    try {

      const response = await axios.get(`${url}${endpoint}#END`, { headers, responseType: 'arraybuffer' });

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

    } catch (error) {
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