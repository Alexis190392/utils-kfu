import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Context } from "necord";
import { Member } from "./entities/member.entity";
import { CreateRoleDto } from "./dtos/create-role.dto";



@Injectable()
export class DiscordBotService {
  private readonly logger = new Logger('DiscordService')

}
