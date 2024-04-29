import { Injectable } from '@nestjs/common';
import axios from "axios";
import { BannerService } from "../banner/banner.service";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import * as process from "process";

@Injectable()
export class SteamService {

  private readonly apiKey = process.env.STEAM_KEY;
  constructor(
    private readonly bannerService:BannerService,
  ) {}

  async profile([interaction],steamid:string){
    try {

      const background = 'https://cdn.discordapp.com/attachments/1201023027236847677/1233799491966992539/Default_welcome_to_wallpaper_for_discord_for_new_members_with_2.jpg?ex=662fba51&is=662e68d1&hm=b2e1ece289e2b71537f82a94c911d339197d87736592c5b3c7eba06d570c85ef&'
      const url = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${this.apiKey}&steamids=${steamid}`;

      const response = await axios.get(url);
      const avatarFull = response.data.response.players[0].avatarfull;
      const profileUrl = response.data.response.players[0].profileurl;
      const nickname = response.data.response.players[0].personaname;
      const canvasImage = await this.bannerService.createCanvas(background, avatarFull, nickname, "","steam");

        const button = new ButtonBuilder()
          .setLabel(`Steam: ${nickname}`)
          .setURL(profileUrl)
          .setStyle(ButtonStyle.Link);

        const rowbuttons = new ActionRowBuilder()
          .addComponents(button);

        await interaction.reply({ files: [canvasImage], components: [rowbuttons] });

    } catch (error) {
      console.error('Ocurrió un error al obtener la página:', error);
    }
  }

}
