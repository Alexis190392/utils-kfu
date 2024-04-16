import { Controller } from '@nestjs/common';
import { DiscordBotService } from './discord-bot.service';

@Controller('discord-bot')
export class DiscordBotController {
  constructor(private readonly discordBotService: DiscordBotService) {}
}
