import { Injectable } from '@nestjs/common';
import {
  Context, Options,
  SlashCommand,
  SlashCommandContext,
} from "necord";

import { DcService } from "./dc.service";
import { TextDto } from "./dto/discord.texto.dto";
import { WebhookDcService } from "../webhook-dc/webhook-dc.service";
import { ModeratorDcService } from "../moderator-dc/moderator-dc.service";
import { ServerService } from "../server/server.service";

@Injectable()
export class SlashCommands {

  constructor(
     private readonly dcService:DcService,
     private readonly server : ServerService,
     private readonly webhooks : WebhookDcService,
     private readonly moderatorService:ModeratorDcService,
  ) {
  }

  @SlashCommand({
    name: 'ping',
    description: 'Ping-Pong Command',
  })
  async onPing(@Context() [interaction]: SlashCommandContext) {
    return interaction.reply({ content: 'Pong!' });
  }

  @SlashCommand({
    name: 'send',
    description: 'Enviar mensaje al servidor'
  })
  async onSend(@Context() [interaction]: SlashCommandContext, @Options() { text }: TextDto) {
    const response=  await this.moderatorService.sendMessage(text, [interaction])
    return interaction.reply({content: response });
  }

  @SlashCommand({
    name: 'roles',
    description: 'Extraer roles'
  })
  async onRole(@Context() [interaction]){
    await this.dcService.getRoles([interaction]);
    return interaction.reply({content: "Prueba rol" });
  }

  @SlashCommand({
    name: 'users',
    description: 'Extraer users'
  })
  async onUsers(@Context() [interaction]){
    await this.dcService.getUsers([interaction]);
    return interaction.reply({content: "Prueba users" });
  }


  @SlashCommand({
    name: 'add-server',
    description: 'Agregar servidor'
  })
  async onServers(@Context() [interaction]){
     await this.server.createServer([interaction])
  }

  @SlashCommand({
    name: 'admin',
    description: 'Estado de moderadores'
  })
  async onSeeModeratos(@Context() [interaction]){
    await this.moderatorService.SeeModeratos([interaction])
  }

  @SlashCommand({
    name: 'set-admin',
    description: 'Agregar permisos admin'
  })
  async onSetModeratos(@Context() [interaction]){
    await this.moderatorService.selectModerator([interaction])
  }

  @SlashCommand({
    name: 'del-admin',
    description: 'Eliminar permisos admin'
  })
  async onDeleteModeratos(@Context() [interaction]){
    await this.moderatorService.deleteModerator('Rythm')
  }

  @SlashCommand({
    name: 'test',
    description: 'Eliminar despues'
  })
  async onTest(@Context() [interaction]){

     // await this.channelService.create([interaction],"Nueva cat6",0,'1228219088246014032')
    // await  this.channelService.editName([interaction],'1228222659054141503', '💔-lalala')
    // await  this.channelService.editName([interaction],'1228222659054141503', '💚-lalala')

   // await this.webhooks.create([interaction],"PruebaWH4")
    const aver = await interaction.member.id;
    console.log(aver);

    // console.log(await interaction.guild.channels.fetch())
  }


}