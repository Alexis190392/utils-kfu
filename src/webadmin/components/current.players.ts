import axios from "axios";
import * as cheerio from 'cheerio';
import { Commons } from "../../commons/commons";
import { PlayerDto } from "../dtos/player.dto";

export class CurrentPlayers{

  constructor(
    private readonly commons:Commons,
  ) {
  }

  async players(url: string, endpoint: string, credentials: string) {
    const headers = {
      'Authorization': `Basic ${credentials}`,
    };

    try {

      const response = await axios.get(`${url}${endpoint}`, { headers });

      const html = response.data;
      const $ = cheerio.load(html);
      const players: PlayerDto[] = [];

      $('table tr').each((index, element) => {
        if (index !== 0) { // Saltar la primera fila (encabezados)
          const columns = $(element).find('td');

          // Extraer datos de cada columna
          const name = $(columns[3]).text().trim();
          const team = $(columns[4]).text().trim();
          const ping = $(columns[5]).text().trim();
          const score = $(columns[6]).text().trim();
          const teamKills = $(columns[7]).text().trim();
          const ip = $(columns[8]).text().trim();
          const globalId = $(columns[9]).text().trim();

          // Verificar si los datos están vacíos o no son útiles
          if (name && team && ping && score && teamKills && ip && globalId
            && name !== "Name:" && name !== "Minimum players:") {

            const kick = $(columns[0]).find('input[name^="Kick"]').attr('name');
            const session = $(columns[1]).find('input[name^="Session"]').attr('name');
            const ban = $(columns[2]).find('input[name^="Ban"]').attr('name');

            const player: PlayerDto = {
              name,
              team,
              ping,
              score,
              teamKills,
              ip,
              globalId,
              kick,
              session,
              ban,
            };

            players.push(player)
          }
        }
      });

      return players;
    } catch (error) {
      throw new Error(error.message);
    }

  }
}