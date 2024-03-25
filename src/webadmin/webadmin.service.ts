import { Injectable } from '@nestjs/common';
import * as process from "process";
import { Commons } from "../commons/commons";
import axios from "axios";

@Injectable()
export class WebadminService {

  private readonly baseUrl = `http://${process.env.WEBADMIN_URI}:${process.env.WEBADMIN_PORT}${process.env.DEFAULT_ENDPOINT}`;
  private readonly userAdmin = process.env.WEBADMIN_USER;
  private readonly password = process.env.WEBADMIN_PASS;

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



}
