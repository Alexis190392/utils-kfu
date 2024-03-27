import { Injectable } from "@nestjs/common";
import axios from "axios";

import { Commons } from "../../commons/commons";

@Injectable()
export class WebadminConnect {

  constructor(
    private readonly commons:Commons
  ) {
  }

  async getConnection(url: string, userAdmin: string, password: string){

    // const url = this.baseUrl;
    const credentials = this.commons.encodeToBase64(`${userAdmin}:${password}`);

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




}