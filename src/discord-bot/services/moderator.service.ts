import { Injectable, Logger } from "@nestjs/common";
import { StringSelect } from "necord";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {
  ActionRowBuilder,
  EmbedBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder } from "discord.js";

import { WebadminService } from "../../webadmin/webadmin.service";
import { DiscordBotService } from "../discord-bot.service";
import { Commons } from "../../commons/commons";
import { Moderator, Server } from "../entities";
import { RoleService } from "./role.service";


@Injectable()
export class ModeratorService{
  private readonly logger = new Logger('ModeratorService')

  constructor(
    private readonly webadminService: WebadminService,
    private readonly dcService:DiscordBotService,
    private readonly roleService: RoleService,
    private readonly commons:Commons,

    @InjectRepository(Moderator)
    private readonly moderatorRepository: Repository<Moderator>,
    @InjectRepository(Server)
    private readonly serverRepository: Repository<Server>,

  ) {}


  async verifyModerator([interaction]) {
    const ownerId = await interaction.channel.guild.ownerId;
    const member = await interaction.member;

    if (ownerId === member.id)
      return true;

    const allows= await this.getModerators();
    const roles = member.roles.cache.map(role => role.name);

    let verify : boolean = false;

    for (const allow of allows) {
      for (const role of roles) {
        if (allow.name === role){
          verify = true;
          break;
        }
        if (verify)
          break;
      }
    }
    return verify;
  }

  async sendMessage([interaction],text:string){
    const verify: boolean = await this.verifyModerator([interaction]);


    if (verify){

      const channel = await interaction.channel.fetch();
      let baseUrl = ''
      let credentials = ''

      const servers = await this.serverRepository.find();
      for (const server of servers) {
        if (server.channelId === channel.id){
          baseUrl = `${server.ip}:${server.port}`
          credentials = this.commons.encodeToBase64(`${server.user}:${server.pass}`);
          break;
        }
      }
      await this.webadminService.sendToGame(text, baseUrl, credentials)
      return `Mensaje enviado: \`\`\`${text}\`\`\``;
    } else {
      return 'No tiene privilegios para este comando';
    }
  }

  async getModerators(){
    return await this.moderatorRepository.find();
  }

  async deleteModerator(name:string){
    try {
      await this.moderatorRepository.delete({name:name});
      return `El rol \`${name}\` ya no cuenta con permisos.`;
    }catch (e) {
      this.logger.error(e.message);
      return `Ocurrio un error al eliminar el rol \`${name}\``;
    }

  }

  async listModerators([interaction], list:Moderator[]){

    const member = await interaction.member;
    const guild = await interaction.guild;
    const name = guild.name;
    const color = this.commons.decimalToHex(member.user.accentColor);
    const icon = `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.webp`;
    const iconUser = `https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}.webp`;
    let message = '';
    if (list.length > 0) {
      for (const mod of list) {
        message = `${message}- ${mod.name}\n`;
      }
    }else {
      message = 'Aún no se han asignado roles.'
    }

    const embed = new EmbedBuilder();
    embed.setColor(color);
    embed.setThumbnail(iconUser);
    embed.addFields(
      { name: 'Roles permitidos Admin:', value: message },
      { name: '\u200B', value: '\u200B'},
      { name: '/admin', value: `Listar roles permitidos`},
      { name: '/set-admin', value: `Permitir nuevo rol`},
      { name: '/del-admin', value: `Negar permisos rol`}

    );

    embed.setTimestamp();
    embed.setFooter({
      text: name,
      iconURL: icon
    })
    try {
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      this.logger.error(`Error al enviar el mensaje: ${error}`);
    }

  }

  async SeeModeratos( [interaction]) {
    const allows= await this.getModerators();
    await this.listModerators([interaction],allows);
  }

  @StringSelect('SELECT_MODERATOR')
  async selectModerator([interaction], status:boolean){
    const verify: boolean = await this.verifyModerator([interaction]);

    if (!verify)
      return interaction.reply({content: "No tiene privilegios para este comando" });

    const moderator= new Moderator();
    const roles = await this.roleService.getRoles([interaction]);

    const stringSelect = new StringSelectMenuBuilder();
    stringSelect.setCustomId('moderators')
    stringSelect.setPlaceholder('Selecciona una opción')

    for (const role of roles) {
      stringSelect.addOptions(
        new StringSelectMenuOptionBuilder()
          .setLabel(role.name)
          .setValue(role.name)
      );
    }

    const row = new ActionRowBuilder().addComponents(stringSelect);

    let content = status?'Elija un rol para permitir uso del bot en forma de moderador.':'Elija un rol para eliminar uso del bot en forma de moderador.'

    const response = await interaction.reply({
      content:  content,
      components: [row],
    });

    const collectorFilter = ({ user }) => user.id === interaction.user.id;
    try {
      const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60000 });
      const selectedValues = confirmation.values;

      if (selectedValues.length > 0) {
        const selectedValue = selectedValues[0];

        moderator.name = selectedValue;

        if (status){
          const moderatorSave = this.moderatorRepository.create(moderator);
          await this.moderatorRepository.save(moderatorSave);
        } else {
          await this.moderatorRepository.delete(moderator);
        }

        content = status ? `Se añadió permisos de uso a: `:`Se eliminó permisos de uso a: `


        await confirmation.update({ content: `${content}${selectedValue}`,components: []});
      }

    }catch (e){
      const content = this.codeError(e.code,moderator.name)
      await response.edit({content:`${content}`,components: []})
    }

  }

  private codeError(code:string, value:string){
    switch (code) {
      case '23505':
        return `El rol \`${value}\` ya se encuentra añadido.\n \`\`\`/admin para ver lista de permitidos.\`\`\``;
      case 'InteractionCollectorError':
        return 'Tiempo de respuesta agotado. No se ha seleccionado una opción.'

    }
  }
}