import { Injectable } from "@nestjs/common";
import { Context, Options, SlashCommand, SlashCommandContext } from "necord";
import { SteamService } from "./steam.service";
import { SteamUrlDto } from "./dtos/steamUrl.dto";

@Injectable()
export class SteamSlash{

  constructor(
    private readonly steamService:SteamService
  ) {
  }

  @SlashCommand({
    name: 'steam',
    description: 'Compartir perfil Steam'
  })
  async onSteamProfile(@Context() [interaction]: SlashCommandContext, @Options() { id }: SteamUrlDto) {
    await this.steamService.profile([interaction],id);
  }

}