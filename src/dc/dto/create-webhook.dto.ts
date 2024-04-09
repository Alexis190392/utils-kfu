import { IsString } from "class-validator";
import { Server } from "../../server/entities/server.entity";

export class CreateWebhookDto{

  @IsString()
  url : string;

  server: Server;
}