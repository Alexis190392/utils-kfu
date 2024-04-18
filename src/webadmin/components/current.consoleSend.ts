import { Injectable } from "@nestjs/common";
import axios from "axios";

@Injectable()
export class CurrentConsoleSend{

  async sendMessage(sendText: string, url: string, credentials:string): Promise<any> {
    try {
      const path = '/ServerAdmin/current_console';
      const postData = `SendText=say+(BotDiscordAdmin) ${encodeURIComponent(sendText)}&Send=Send`;
      const headers = {
        'Authorization': `Basic ${credentials}`,
        'Connection': 'close'
      };

      const response = await axios.post(`http://${url}${path}`,postData,{headers})


      const statusCode = response.status;

      const responseData = statusCode===200?'Enviado correctamente':'Se produjo un error';

      return { statusCode, responseData };
    } catch (error) {
      throw new Error(`Error al enviar mensaje: ${error.message}`);
    }
  }

}