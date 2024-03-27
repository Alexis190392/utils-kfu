import { Injectable } from "@nestjs/common";
import axios from "axios";

@Injectable()
export class WebadminConnect {

  async getConnection(url: string, credentials: string){

    const headers = {
      'Authorization': `Basic ${credentials}`,
    };

    try {
      const response = await axios.get(url, { headers });

      if (response.status === 200){
        return true
      }

    } catch (error) {
      console.log(error)
      return false
    }

  }




}