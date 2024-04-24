import { Injectable } from "@nestjs/common";
import { TempVoiceService } from './temp-voice.service';
import { Context, SlashCommand } from "necord";
import { Client } from "discord.js";
import { ChannelService } from "../discord-bot/services";

@Injectable()
export class TempVoiceSlash {
  constructor(
    private readonly tempVoiceService: TempVoiceService,
    private readonly channelService: ChannelService,
    private readonly client: Client,
    ) {}

  @SlashCommand({
    name: 'temp-voice',
    description: 'Canal de voz dinámico'
  })
  async onTempVoice(@Context() [interaction]){
    await this.tempVoiceService.generate([interaction]);
  }

  //TODO pruebas
  // @SlashCommand({
  //   name: 'test',
  //   description: 'Pruebas dev'
  // })
  // async onTest(){
  //   const channelId= await this.channelService.createWithClient(this.client,'test',2);
  //   console.log(channelId);
  //
  // }



}
