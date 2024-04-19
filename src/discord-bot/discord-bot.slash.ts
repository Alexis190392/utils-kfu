import { Context, Options, SlashCommand, SlashCommandContext } from "necord";

import { Injectable } from "@nestjs/common";
import { DiscordBotService } from "./discord-bot.service";
import { TextDto } from "./dtos/discord.texto.dto";
import { KfService, MemberService, ModeratorService, RoleService, WebhookService } from "./services";

@Injectable()
export class DiscordBotSlash{

  constructor(
    private readonly dcService:DiscordBotService,
    private readonly server :KfService,
    private readonly webhooks : WebhookService,
    private readonly moderatorService:ModeratorService,
    private readonly roleService: RoleService,
    private readonly memberService: MemberService,

  ) {
  }

  // @SlashCommand({
  //   name: 'ping',
  //   description: 'Ping-Pong Command',
  // })
  // async onPing(@Context() [interaction]: SlashCommandContext) {
  //   return interaction.reply({ content: 'Pong!' });
  // }

  @SlashCommand({
    name: 'send',
    description: 'Enviar mensaje al servidor'
  })
  async onSend(@Context() [interaction]: SlashCommandContext, @Options() { text }: TextDto) {
    const response=  await this.moderatorService.sendMessage([interaction],text)
    return interaction.reply({content: response });
  }

  // @SlashCommand({
  //   name: 'roles',
  //   description: 'Extraer roles'
  // })
  // async onRole(@Context() [interaction]){
  //   await this.roleService.getRoles([interaction]);
  //   return interaction.reply({content: "Prueba rol" });
  // }

  // @SlashCommand({
  //   name: 'users',
  //   description: 'Extraer users'
  // })
  // async onUsers(@Context() [interaction]){
  //   await this.memberService.getUsers([interaction]);
  //   return interaction.reply({content: "Prueba users" });
  // }


  @SlashCommand({
    name: 'new-server',
    description: 'Agregar servidor'
  })
  async onNewServer(@Context() [interaction]){
    await this.server.createServer([interaction])
  }

  @SlashCommand({
    name: 'list-servers',
    description: 'Ver servidores añadidos'
  })
  async onListServers(@Context() [interaction]){
    await this.server.listServers([interaction]);
  }

  @SlashCommand({
    name: 'list-admin',
    description: 'Estado de moderadores'
  })
  async onSeeModeratos(@Context() [interaction]){
    await this.moderatorService.SeeModeratos([interaction])
  }

  @SlashCommand({
    name: 'allow-admin',
    description: 'Agregar permisos admin'
  })
  async onSetModeratos(@Context() [interaction]){
    await this.moderatorService.selectModerator([interaction])
  }

  @SlashCommand({
    name: 'remove-admin',
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
    // await  this.channelService.editName([interaction],'1228222659054141503', '💚💛-lalala')

    // await this.webhooks.create([interaction],"PruebaWH4")
    // const aver = await interaction.member.id;
    const aver = await interaction.guildId;
    console.log(aver);

    // console.log(await interaction.guild.channels.fetch())
  }
}