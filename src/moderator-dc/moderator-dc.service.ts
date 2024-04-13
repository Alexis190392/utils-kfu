import { Injectable, Logger } from "@nestjs/common";
import { WebadminService } from "../webadmin/webadmin.service";
import { DcService } from "../dc/dc.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { StringSelect } from "necord";
import { ActionRowBuilder, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";
import { Moderator } from "./entities/moderator.entity";
import { DcUtils } from "../dc/dc.utils";

@Injectable()
export class ModeratorDcService {
  private readonly logger = new Logger('ModeratorService')

  constructor(
    private readonly webadminService: WebadminService,
    private readonly dcService:DcService,
    private readonly utils:DcUtils,

    @InjectRepository(Moderator)
    private readonly moderatorRepository: Repository<Moderator>,

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

  async sendMessage(text:string, [interaction]){
    const verify: boolean = await this.verifyModerator([interaction]);

    if (verify){
      await this.webadminService.sendMessage(text);
      return `Mensaje enviado: ${text}`;
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
    const color = this.utils.decimalToHex(member.user.accentColor);
    const icon = `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.webp`;
    const iconUser = `https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}.webp`;
    let message = '';
    for (const mod of list) {
      message =`${message}- ${mod.name}\n`
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
    await interaction.reply({ embeds: [embed] });

  }

  async SeeModeratos( [interaction]) {
    const allows= await this.getModerators();
    const embed = this.listModerators([interaction],allows);
  }

  @StringSelect('SELECT_MODERATOR')
  async selectModerator([interaction]){
    const verify: boolean = await this.verifyModerator([interaction]);

    if (!verify)
      return interaction.reply({content: "No tiene privilegios para este comando" });

    const moderator= new Moderator();
    const roles = await this.dcService.getRoles([interaction]);

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

    const response = await interaction.reply({
      content: 'Elija un rol para permitir uso del bot en forma de moderador.',
      components: [row],
    });

    const collectorFilter = ({ user }) => user.id === interaction.user.id;
    try {
      const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60000 });
      const selectedValues = confirmation.values;

      if (selectedValues.length > 0) {
        const selectedValue = selectedValues[0];

        moderator.name = selectedValue;

        const moderatorSave = this.moderatorRepository.create(moderator);
        await this.moderatorRepository.save(moderatorSave);

        await confirmation.update({ content: `Se añadió permisos de uso a: ${selectedValue}`,components: []});
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
