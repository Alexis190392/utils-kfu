import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException } from "@nestjs/common";
import { Commons } from "../../commons/commons";
import { WebadminService } from "../../webadmin/webadmin.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Server } from "../entities/server.entity";
import { ModalComponent } from "../components/modal.component";
import { ModeratorService } from "./moderator.service";
import { CreateServerDto } from "../dtos/create-server.dto";
import { ChannelService } from "./channel.service";
import { WebhookService } from "./webhook.service";
import { EmbedBuilder } from "discord.js";
import { EmbedFieldsDto } from "../dtos/embedFields.dto";
import { Cron } from "@nestjs/schedule";


@Injectable()
export class KfService{
  private readonly logger = new Logger('KfService');


  private servers:Server[] = [];

  constructor(
    private readonly commons: Commons,
    private readonly modalComponent:ModalComponent,
    private readonly moderatorService:ModeratorService,
    private readonly channelService:ChannelService,
    private readonly webhookService:WebhookService,
    private readonly webadminService:WebadminService,

    @InjectRepository(Server)
    private readonly serverRepository : Repository<Server>,
  ) {
  }

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
        newServer.name = name;
        newServer.ip = ip;
        newServer.port = port;
        newServer.user = user;
        newServer.pass = pass;
        newServer.channelId = channelId;
        newServer.webhook = webhookId;

        const server = await this.create(newServer);
        this.logger.log(`New server: ${server.name}  - ID: ${server.id}`)

        modalInteraction.reply({
          content: `Nuevo server agregado: \`\`\`${server.name}\`\`\``,
        })
        await this.fetch();

      })
      .catch((e)=>{
        this.logger.warn(`No hubo respuesta: ${e.message}`)
      });
  }
  @Cron('0 */10 * * * *')
  private async fetch(){
    this.servers = await this.findAll();
  }

  private async isPresent(ip:string , port:string){
    const server = await this.serverRepository.findOneBy({ip});
    if (!server)
      return false;

    if(server.port === port)
      return true;
  }

  @Cron('*/10 * * * * *')
  async process(){
    if (this.servers.length === 0)
      this.servers = await this.findAll();

    const servers = this.servers;

    for (const server of servers) {
      if (server.isActive){
        const baseUrl = `http://${server.ip}:${server.port}/ServerAdmin`
        const credentials = this.commons.encodeToBase64(`${server.user}:${server.pass}`);

        const message = await this.webadminService.cronDataLogs(baseUrl, credentials, server.name, server.channelId ,server.webhook);
        await this.webhookService.sendMessage(message, server.channelId, server.webhook)
      }
    }
  }

  @Cron('*/20 * * * * *')
  async statusServer(){
    this.servers = await this.findAll();

    const servers = this.servers;

    for (const server of servers) {
      let status = '';
      if (server.isActive){
        const baseUrl = `http://${server.ip}:${server.port}/ServerAdmin`
        const credentials = this.commons.encodeToBase64(`${server.user}:${server.pass}`);
        status =  await this.webadminService.getConnection(baseUrl, credentials);

      }else {
        status = 'notActive';
      }
      await this.channelService.editName(server.channelId, server.name, status)
    }
  }

  async listServers([interaction]) {

    const member = await interaction.member;
    const guild = await interaction.guild;
    const name = guild.name;
    const color = this.commons.decimalToHex(member.user.accentColor);
    const icon = `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.webp`;
    const iconUser = `https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}.webp`;

    const serverList = await this.findAll()
    const fields = [];

    for (const server of serverList) {
      const field = new EmbedFieldsDto();
      field.name = server.name;
      field.value = `${server.ip}:${server.port}`;
      fields.push(field);
    }

    const embed = new EmbedBuilder();
    embed.setTitle('Servers');
    embed.setColor(color);
    embed.setThumbnail(iconUser);
    embed.addFields(...fields);
    embed.setTimestamp();
    embed.setFooter({
      text: name,
      iconURL: icon
    })

    try {
      return await interaction.reply({ embeds: [embed] });
    } catch (error) {
      this.logger.error(`Error al enviar el mensaje: ${error}`);
    }
  }
}