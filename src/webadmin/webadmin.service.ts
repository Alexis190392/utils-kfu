import { Injectable } from "@nestjs/common";
import * as process from "process";
import { Commons } from "../commons/commons";
import axios from "axios";
import { Cron } from "@nestjs/schedule";

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
    console.log("Se ejecuta cron");
    let data= await this.dataLogs();
    // data = this.commons.decodeParams(data);
    let logsList: string[] = this.commons.splitLines(data);
    // logsList = await this.guardarYObtenerMensajesNuevos(logsList);
    console.log(logsList)
    this.cache = await this.newMessages(logsList);
    return this.dataLogs();
  }

  // async dataLogs():Promise<string>{
  //   const url = `${this.baseUrl}/current_console_log`;
  //   const credentials = this.commons.encodeToBase64(`${this.userAdmin}:${this.password}`);
  //
  //   const headers = {
  //     'Authorization': `Basic ${credentials}`,
  //   };
  //
  //   try {
  //     const response = await axios.get(url, { headers });
  //     return response.data;
  //     // if (response.status === 200){
  //     //   return true
  //     // }
  //
  //   } catch (error) {
  //     console.log(error)
  //     return error
  //   }
  // }


  async dataLogs(): Promise<string> {
    const url = `${this.baseUrl}/current_console_log`;
    const credentials = this.commons.encodeToBase64(`${this.userAdmin}:${this.password}`);

    const headers = {
      'Authorization': `Basic ${credentials}`,
    };

    try {
      const response = await axios.get(url, { headers });
      const consoleLogHtml = response.data;
      const startTag = '&gt;';
      const endTag = '<a name="END"></a>';
      const startIndex = consoleLogHtml.indexOf(startTag);
      const endIndex = consoleLogHtml.indexOf(endTag);
      let consoleLogText = ""
      if (startIndex !== -1 && endIndex !== -1) {
        consoleLogText = consoleLogHtml.substring(startIndex + startTag.length, endIndex).trim();
        consoleLogText = this.commons.decodeParams(consoleLogText);
      }
        return consoleLogText;
        //throw new Error('No se pudo encontrar el contenido de la consola en la respuesta HTML.');

    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  async newMessages(messages: string[]){
    let newMessageList: string[] = [];

    if (this.cache.length === 0 || messages.every((element, index) => element === this.cache[index])){
      this.cache = messages;
      return this.cache;
    } else {
      let startIndex = -1;
      for (let i = this.cache.length - 1, j = messages.length - 1; i >= 0 && j >= 0; i--, j--) {
        if (this.cache[i] === messages[j]) {
          startIndex = i;
        } else {
          break;
        }
      }

      console.log("---------------------------------")
      if (startIndex !== -1 && startIndex + 1 < messages.length) {
        newMessageList = messages.slice(startIndex)
         // this.cache = { ...newMessageList };
        console.log(newMessageList);
        return newMessageList;
      } else {
        console.log("No hay coincidencias consecutivas en las listas.");
        return newMessageList;
      }
    }
  }




}
