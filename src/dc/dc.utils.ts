import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class DcUtils {
  private readonly logger = new Logger('DcUtils');
  filterTypeChannels(list: { name: string; type: number;}[], type: number){
    const listNameChannels : string[] = [];

    list.forEach((channel) => {
      const name = channel.name;
      // const type = channel.type;
      if (channel.type === type)
        listNameChannels.push(name);
    })
    return listNameChannels;
  }

  findIDByChannelName(name , data){
    let channelID: any;
    data.forEach((channel: { name: string; id: any; }) => {
      if(channel.name === name.toLowerCase()){
        channelID = channel.id;
      }
    });
    return channelID;
  }

  formatToSelect(channels: string[]) {
    const listChannel = [];
    for (const channel of channels) {
      listChannel.push({
        label: channel,
        value: channel,
      })
    }
    return listChannel;
  }

  decimalToHex(decimal){

    try {
      let hex = decimal.toString(16).toUpperCase();
      return  hex.padStart(6, '0');
    } catch (e){
      this.logger.warn(`${e.message} - Set default #D8D8D8`)
      return  '#D8D8D8';
    }

  }
}