import { Injectable } from '@nestjs/common';
import {
  Context, Options,
  SlashCommand,
  SlashCommandContext, StringOption
} from "necord";

import { ComponentsModals } from "./components";
import { DcService } from "./dc.service";
import { TextDto } from "./dto/discord.texto.dto";

@Injectable()
export class SlashCommands {

  constructor(
     private readonly dcService:DcService,
     private readonly modals:ComponentsModals,
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
    name: 'setup',
    description: 'setup'
  })
  async onSetup(@Context() [interaction]){
    //TODO
    return interaction.reply({content: 'setup'})
  }

  @SlashCommand({
    name: 'send',
    description: 'Enviar mensaje al servidor'
  })
  async onSend(@Context() [interaction]: SlashCommandContext, @Options() { text }: TextDto) {
    const response=  await this.dcService.sendMessage(text, [interaction])
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
     await this.modals.createServer([interaction])
  }

  @SlashCommand({
    name: 'add-webhook',
    description: 'Agregar webhook de canal para recibir notificaciones'
  })
  async onAddWebhook(@Context() [interaction]){
    try {
      await this.dcService.addWhebhook([interaction]);
    } catch (e) {
      return interaction.reply({content: "No hay servers configurados" });
    }

  }

  @SlashCommand({
    name: 'admin',
    description: 'Estado de moderadores'
  })
  async onSeeModeratos(@Context() [interaction]){
    await this.dcService.SeeModeratos([interaction])
  }

  @SlashCommand({
    name: 'set-admin',
    description: 'Agregar permisos admin'
  })
  async onSetModeratos(@Context() [interaction]){
    await this.dcService.selectModerator([interaction])
  }

  @SlashCommand({
    name: 'del-admin',
    description: 'Eliminar permisos admin'
  })
  async onDeleteModeratos(@Context() [interaction]){
    await this.dcService.deleteModerator('Rythm')
  }

  @SlashCommand({
    name: 'info',
    description: 'info del lugar'
  })
  async onInfo(@Context() [interaction]){
    //info general de interaccion:
    // console.log(await interaction)

    //info general del servidor:
    // console.log(await interaction.guild)
     console.log(await interaction.guild.channels.fetch()) //listado de canales
    // console.log(await interaction.guild.members.fetch()) //listado de miembros del servidor y sus detalles


    //info del canal:
    // console.log(await interaction.channel) //general del canal actual
    // console.log(await interaction.channel.id) //id del canal actual
    // console.log(await interaction.member.user) //detalles del usuario que ejecuta comando



    // await interaction.guild.channels.create({
    //   name:'soy un canal nuevo',
    //   type: 0, // Puedes cambiarlo a (0 texto, 2 voz, 4 categoria)
    //   // parentId: '123', //para categoria
    //
    // });


    //  const channel = await interaction.guild.channels.cache.get('1228181687951822940');
    //
    //
    // await channel.edit({
    //   name: 'lalala 🛑' ,
    //   // topic: 'nuevo_tema_del_canal',
    //   // Otras propiedades que deseas modificar
    // });

    return interaction.reply({content: "Info en logs" });
  }



  //muestra listado de canales de texto
  // @SlashCommand({
  //   name: 'logs-server',
  //   description: 'Select a text channel for server logs',
  // })
  // public async onLogsServer(@Context() [interaction]: SlashCommandContext){
  //   await this.discordService.onLogsServer([interaction]);
  // }

}