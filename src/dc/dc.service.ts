import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Context, StringSelect } from "necord";

import { Commons } from "../commons/commons";
import { Member, Moderator, Role } from "./entities";
import { CreateRoleDto } from "./dto/create-role.dto";
import { WebadminService } from "../webadmin/webadmin.service";
import { StringSelectMenu } from "./components";
import { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";

@Injectable()
export class DcService {
  private readonly logger = new Logger('DiscordService')
  constructor(
    private readonly webadminService: WebadminService,
    private readonly commons :Commons,
    private readonly selectMenu:StringSelectMenu,

    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,

    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,

    @InjectRepository(Moderator)
    private readonly moderatorRepository: Repository<Moderator>,

  ) {}

  private async verifyModerator(@Context() [interaction]) {
    const allows= await this.getModerators();
    const member = await interaction.member;
    const roles = member.roles.cache.map(role => role.name);

    let verify : boolean = false;

    for (const allow of allows) {
      for (const role of roles) {
        if (allow.name === role){
          console.log(allow.name);
          verify = true;
          break;
        }
        if (verify)
          break;
      }
    }
    return verify;
  }
  async sendMessage(text:string,@Context() [interaction]){
    const verify: boolean = await this.verifyModerator([interaction]);

    if (verify){
      await this.webadminService.sendMessage(text);
      return `Mensaje enviado: ${text}`;
    } else {
      return 'No tiene privilegios para este comando';
    }
  }

  async getRoles(@Context() [interaction]){
    const rolesDC = await interaction.guild.roles.fetch();

    const roles=[];

    rolesDC.forEach(role => {
      const roleAdd = new CreateRoleDto();
      roleAdd.id = role.id;
      roleAdd.name = role.name;
      roles.push(roleAdd)
    })

    return roles;
  }

  async getUsers(@Context() [interaction]){
    const members = await interaction.guild.members.fetch();

    for (const member of members.values()) {
      const memberAdd = new Member();
      memberAdd.id = member.user.id;
      memberAdd.username= member.user.username;
      memberAdd.discriminator = member.user.discriminator;
      memberAdd.globalName = member.user.globalName;
      memberAdd.avatarHash = member.user.avatar;
      memberAdd.bot = member.user.bot;
      memberAdd.system = member.user.system;
      memberAdd.bannerHash = member.user.banner;
      memberAdd.accentColor = member.user.accentColor;
      memberAdd.flags = member.user.flags;
      memberAdd.avatarDecorationHash = member.user.avatarDecoration;
      memberAdd.joinedAt = member.joinedAt;
      memberAdd.timeInServer = this.timeDifference(member.joinedAt);

      memberAdd.roles = [];
      for (const role of member.roles.cache.values()) {
        memberAdd.roles.push(role.name);
      }

      try {
        await this.memberRepository.save(memberAdd);
      } catch (e){
        this.logger.error(`No se pudo agregar el usuario: ${memberAdd.username}`)
      }
    }
  }

  private timeDifference(value: Date){
    const currentDate = new Date();
    const timeDifference = currentDate.getTime() - value.getTime();
    return Math.floor(timeDifference / (365.25 * 24 * 60 * 60 * 1000));
  }

  private async addModerator(){}


  @StringSelect('SELECT_MODERATOR')
  async selectModerator(@Context() [interaction]){
    const verify: boolean = await this.verifyModerator([interaction]);

    if (!verify)
      return interaction.reply({content: "No tiene privilegios para este comando" });

    const moderator= new Moderator();
    const roles = await this.getRoles([interaction]);

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

  private async getModerators(){
    return await this.moderatorRepository.find();
  }

  private codeError(code:string, value:string){
    switch (code) {
      case '23505':
        return `El rol '${value}' ya se encuentra añadido.`;
      case 'InteractionCollectorError':
        return 'Tiempo de respuesta agotado. No se ha seleccionado una opción.'

    }
  }

}

