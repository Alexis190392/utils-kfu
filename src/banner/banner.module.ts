import { Module } from '@nestjs/common';
import { BannerService } from './banner.service';
import { BannerController } from './banner.controller';
import { BannerSlash } from "./banner.slash";

@Module({
  controllers: [BannerController],
  providers: [
    BannerService,
    BannerSlash
  ],
})
export class BannerModule {}
