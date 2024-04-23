import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { SkipLogs } from "./entities";
import { Repository } from "typeorm";

@Injectable()
export class DiscordBotService {
  private readonly logger = new Logger('DiscordService')

  constructor(
    @InjectRepository(SkipLogs)
    private readonly skipLogsRepository:Repository<SkipLogs>,
  ) {
  }


  async skipLogs([interaction], text : string){
    const channelId = await interaction.channel.id;

    try {
      const skip = new SkipLogs();
      skip.channelId = channelId;
      skip.text = text;
      await this.skipLogsRepository.save(skip);
      return `Agregado: \`\`\`${text}\`\`\``;
    }catch (e) {
      this.logger.error(`No se añadió correctamente: ${text}`)
    }
  }
}
