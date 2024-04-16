import { Injectable, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
import { Commons } from "../../commons/commons";
import { WebadminService } from "../../webadmin/webadmin.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Cron } from "@nestjs/schedule";
import { Server } from "../entities/server.entity";
import { ModalComponent } from "../components/modal.component";
import { ModeratorService } from "./moderator.service";
import { CreateServerDto } from "../dtos/create-server.dto";
import { ChannelService } from "./channel.service";
import { WebhookService } from "./webhook.service";


@Injectable()
export class KfService{
  private readonly logger = new Logger('KfService');


  private servers:Server[] = [];

  constructor(
    private readonly commons: Commons,

    private readonly modalComponent:ModalComponent,
    private readonly moderatorDcService:ModeratorService,

    private readonly channelDcService:ChannelService,
    private readonly webhookDcService:WebhookService,
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

    const verify: boolean = await this.moderatorDcService.verifyModerator([interaction]);

    if (!verify)
      return interaction.reply({content: "No tiene privilegios para este comando" });

    const modal = await this.modalComponent.newServer([interaction]);
    const modalMessage = await interaction.showModal(modal);

    const filter= (interaction) => interaction.customId === `newServer-${interaction.user.id}`;

    interaction.awaitModalSubmit({filter,time:60000})
      .then(async (modalInteraction)=>{
        const name = modalInteraction.fields.getTextInputValue('name');
        const ip = modalInteraction.fields.getTextInputValue('ip');
        const port = modalInteraction.fields.getTextInputValue('port');
        const user = modalInteraction.fields.getTextInputValue('user');
        const pass = modalInteraction.fields.getTextInputValue('pass');

        if (await this.isPresent(ip, port))
          return interaction.reply({content: `El servidor ${ip}:${port} ya se encuentra añadido` });

        const channelId = await this.channelDcService.create([interaction],name,0);
        const webhookId = await this.webhookDcService.create([interaction],`${name} Logs`,channelId);

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

        modalInteraction.reply(`Nuevo server agregado: ${server.name}`)
        await this.fetch();

      })
      .catch((e)=>{
        this.logger.warn(`No hubo respuesta: ${e.message}`)
      });
  }

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

  @Cron('*/5 * * * * *')
  async process(){
    if (this.servers.length === 0)
      this.servers = await this.findAll();


    console.log("#############################");
    console.log(this.servers.length);
    console.log("#############################");

    for (const server of this.servers) {

      if (server.isActive){
        console.log(server.name);
        console.log("_______________________________");
        const baseUrl = `http://${server.ip}:${server.port}/ServerAdmin`
        const credentials = this.commons.encodeToBase64(`${server.user}:${server.pass}`);
        const webhookId = server.webhook;
        await this.webadminService.cronDataLogs(baseUrl, credentials, webhookId);
      }
    }
  }
}