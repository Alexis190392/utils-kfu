import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {
  ActionRowBuilder,
  EmbedBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder } from "discord.js";

import { Commons } from "../../commons/commons";
import { WebadminService } from "../../webadmin/webadmin.service";
import { Server } from "../entities";
import { ModalComponent } from "../components/modal.component";
import { ModeratorService } from "./moderator.service";
import { CreateServerDto } from "../dtos/create-server.dto";
import { ChannelService } from "./channel.service";
import { WebhookService } from "./webhook.service";
import { EmbedFieldsDto } from "../dtos/embedFields.dto";

@Injectable()
export class KfService{
  private readonly logger = new Logger('KfService');

  constructor(
    private readonly commons: Commons,
    private readonly modalComponent:ModalComponent,
    private readonly moderatorService:ModeratorService,
    private readonly channelService:ChannelService,
    private readonly webhookService:WebhookService,
    private readonly webadminService:WebadminService,

    @InjectRepository(Server)
    private readonly serverRepository : Repository<Server>,
  ) {}

  async create(createServerDto: CreateServerDto) {
    try {
      const server = this.serverRepository.create(createServerDto);
      await  this.serverRepository.save(server);

      return server
    }catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException(`Ocurrio un error al guardar server:  ${e.message}`);
    }
  }

  async findAll() {
    return await this.serverRepository.find({});
  }

  async findOne(id: string) {
    const server = await this.serverRepository.findOneBy({id});

    if (!server)
      throw new NotFoundException(`Server con id: ${id} no se encuentra`);

    return server;
  }

  async createServer([interaction]){

    const verify: boolean = await this.moderatorService.verifyModerator([interaction]);

    if (!verify)
      return interaction.reply({content: "No tiene privilegios para este comando" });

    const modal = await this.modalComponent.newServer([interaction]);
    await interaction.showModal(modal);
    const icon = `https://cdn.discordapp.com/icons/${interaction.guild.id}/${interaction.guild.icon}.webp`;
    const filter= (interaction) => interaction.customId === `newServer-${interaction.user.id}`;

    interaction.awaitModalSubmit({filter,time:60000})
      .then(async (modalInteraction)=>{
        const name = modalInteraction.fields.getTextInputValue('name');
        const ip = modalInteraction.fields.getTextInputValue('ip');
        const port = modalInteraction.fields.getTextInputValue('port');
        const user = modalInteraction.fields.getTextInputValue('user');
        const pass = modalInteraction.fields.getTextInputValue('pass');

        if (await this.isPresent(ip, port))
          return modalInteraction.reply({content: `El servidor \`\`\`${ip}:${port}\`\`\` ya se encuentra añadido` });

        const channelId = await this.channelService.create([interaction],name,0);
        const webhookId = await this.webhookService.create([interaction],`${name} Logs`,channelId,icon);

        const newServer = new CreateServerDto();
        newServer.guildId = interaction.guildId;
        newServer.name = name;
        newServer.ip = ip;
        newServer.port = port;
        newServer.user = user;
        newServer.pass = pass;
        newServer.channelId = channelId;
        newServer.webhook = webhookId;

        const server = await this.create(newServer);
        this.logger.log(`New server: ${server.name}  - ID: ${server.id}`)
        const embed = await this.listServersEmbed([interaction]);
        embed.setAuthor({name:`Nuevo server agregado: "${server.name}"`,
      })

        modalInteraction.reply({
          embeds: [embed],
        })

      })
      .catch((e)=>{
        this.logger.warn(`No hubo respuesta: ${e.message}`)
      });
  }

  async listServers([interaction]) {
    const embed = await this.listServersEmbed([interaction])

    try {
      return await interaction.reply({ embeds: [embed] });
    } catch (error) {
      this.logger.error(`Error al enviar el mensaje: ${error}`);
    }
  }


  @Cron('*/20 * * * * *')
  async process(){
    const servers = await this.findAll();

    //TODO verificar que si dos o mas server tienen misma ip y puerto, pero diferente guild, solo haga el llamado una vez a la misma ip

    if (servers.length!=0) {
      for (const server of servers) {
        if (server.isActive) {
          await this.webadminService.cronDataLogs(server);
          await this.webhookService.sendMessage();
        }
      }
    }
  }

  private async isPresent(ip:string , port:string){
    const server = await this.serverRepository.findOneBy({ip});
    if (!server)
      return false;

    if(server.port === port)
      return true;
  }
  private async listServersEmbed([interaction]) {

    const member = await interaction.member;
    const guild = await interaction.guild;
    const name = guild.name;
    const color = this.commons.decimalToHex(member.user.accentColor);
    const icon = `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.webp`;
    const iconUser = `https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}.webp`;

    const serverList = await this.findAll()
    const fields = [];

    for (const server of serverList) {
      if (interaction.guildId === server.guildId) {
        const status = server.isActive? '✔':'❌';
        const field = new EmbedFieldsDto();
        field.name = server.name;
        field.value = `${server.ip}:${server.port} \n Actividad logs: ${status}`;
        fields.push(field);
      }
    }

    const embed = new EmbedBuilder();
    embed.setTitle('Servers');
    embed.setColor(color);
    embed.setThumbnail(iconUser);
    embed.addFields(...fields);
    embed.setTimestamp();
    embed.setFooter({
      text: `[/list-servers] Ver servidores.\n[/new-server] Agregar nuevo servidor.\n${name}` ,
      iconURL: icon
    })

    return embed;
  }

  async activity([interaction], newStatus:boolean) {
    const verify: boolean = await this.moderatorService.verifyModerator([interaction]);

    if (!verify)
      return interaction.reply({content: "No tiene privilegios para este comando" });

    const guildId = await interaction.guildId;
    const servers = await this.serverRepository.find({where:{guildId: guildId, isActive:!newStatus}});

    let activity = newStatus?'desactivados':'activados';
    if (servers.length === 0)
      return interaction.reply({content: `No hay servers ${activity}` });

    const stringSelect = new StringSelectMenuBuilder();
    stringSelect.setCustomId('servers')
    stringSelect.setPlaceholder('Selecciona una opción')


    for (const server of servers) {
      if (server.isActive != newStatus){
        stringSelect.addOptions(
          new StringSelectMenuOptionBuilder()
            .setLabel(server.name)
            .setValue(server.channelId)
        );
      }
    }

    const row = new ActionRowBuilder().addComponents(stringSelect);
    activity = newStatus?'activar':'desactivar'

    const response = await interaction.reply({
      content: `Elija el server a ${activity} registros`,
      components: [row],
    });

    const collectorFilter = ({ user }) => user.id === interaction.user.id;
    try {
      const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60000 });
      const selectedValues = confirmation.values;

      if (selectedValues.length > 0) {
        const selectedValue = selectedValues[0];

        const server = servers.find(server => server.channelId === selectedValue);
        server.isActive = newStatus;

        //Cambio el valor de actividad en bd
        const save = this.serverRepository.create(server)
        await this.serverRepository.save(save)

        activity = newStatus?'ACTIVADO':'DESACTIVADO';

        await confirmation.update({
          content: `${activity} el registro de logs para: \`\`\`${server.name}\`\`\` `,
          components: []
        });
      }

    }catch (e){
      await response.edit({content:`${e.message}`,components: []})
      this.logger.error(e.message)
    }

  }
}