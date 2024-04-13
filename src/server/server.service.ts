import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { CreateServerDto } from './dto/create-server.dto';
import { Server } from "./entities/server.entity";
import { ModalComponent } from "./components/modal.component";
import { ModeratorDcService } from "../moderator-dc/moderator-dc.service";

@Injectable()
export class ServerService {

  private readonly logger = new Logger('ServerService');

  constructor(
    private readonly modalComponent:ModalComponent,
    private readonly moderatorDcService:ModeratorDcService,

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
    await interaction.showModal(modal);

    const filter= (interaction) => interaction.customId === `newServer-${interaction.user.id}`;

    interaction.awaitModalSubmit({filter,time:60000})
      .then(async (modalInteraction)=>{
        const name = modalInteraction.fields.getTextInputValue('name');
        const ip = modalInteraction.fields.getTextInputValue('ip');
        const port = modalInteraction.fields.getTextInputValue('port');
        const user = modalInteraction.fields.getTextInputValue('user');
        const pass = modalInteraction.fields.getTextInputValue('pass');

        if (await this.isPresent(ip, port))
          return interaction.reply({content: `El servido ${ip}:${port} ya se encuentra añadido` });

        const newServer = new CreateServerDto();
        newServer.name = name;
        newServer.ip = ip;
        newServer.port = port;
        newServer.user = user;
        newServer.pass = pass;

        const server = await this.create(newServer);
        this.logger.log(`New server: ${server.name}  - ID: ${server.id}`)

        modalInteraction.reply(`Nuevo server agregado: ${server.name}`)

      })
      .catch((e)=>{
        this.logger.warn(`No hubo respuesta: ${e.message}`)
      });
  }
  
  async isPresent(ip:string , port:string){
    const server = await this.serverRepository.findOneBy({ip});
    if (!server)
      return false;

    if(server.port === port)
      return true;
  }

}
