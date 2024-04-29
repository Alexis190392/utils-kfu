import { Module } from '@nestjs/common';
import { SteamService } from './steam.service';
import { SteamController } from './steam.controller';
import { BannerModule } from "../banner/banner.module";
import { SteamSlash } from "./steam.slash";

@Module({
  imports: [BannerModule],
  controllers: [SteamController],
  providers: [
    SteamService,
    SteamSlash
  ],
})
export class SteamModule {}
