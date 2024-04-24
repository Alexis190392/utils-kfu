import { Module } from '@nestjs/common';
import { TempVoiceService } from './temp-voice.service';
import { TempVoiceSlash } from "./temp-voice.slash";
import { DiscordBotModule } from "../discord-bot/discord-bot.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Channel } from "../discord-bot/entities";

@Module({
  controllers: [],
  imports: [
    TypeOrmModule.forFeature([
      Channel,
    ]),
    DiscordBotModule
  ],
  providers: [
    TempVoiceSlash,
    TempVoiceService,
  ],
})
export class TempVoiceModule {}
