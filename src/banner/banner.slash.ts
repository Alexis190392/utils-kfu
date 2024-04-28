import { Injectable } from "@nestjs/common";
import { Context, Options, SlashCommand, SlashCommandContext } from "necord";
import { BannerService } from "./banner.service";

@Injectable()
export class BannerSlash{

  constructor(
    private readonly bannerService:BannerService,
  ) {
  }

  @SlashCommand({
    name: 'test',
    description: 'test canvas'
  })
  async onSend(@Context() [interaction]: SlashCommandContext) {
    await this.bannerService.test([interaction])
  }
}