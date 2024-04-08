import { Injectable, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
import { CreateServerDto } from './dto/create-server.dto';
import { UpdateServerDto } from './dto/update-server.dto';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Server } from "./entities/server.entity";

@Injectable()
export class ServerService {

  private readonly logger = new Logger('ServerService');

  constructor(
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

  // update(id: number, updateServerDto: UpdateServerDto) {
  //   return `This action updates a #${id} server`;
  // }
  //
  // remove(id: number) {
  //   return `This action removes a #${id} server`;
  // }
}
