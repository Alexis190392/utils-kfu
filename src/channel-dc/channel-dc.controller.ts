import { Controller } from '@nestjs/common';
import { ChannelDcService } from './channel-dc.service';

@Controller('channel-dc')
export class ChannelDcController {
  constructor(private readonly channelDcService: ChannelDcService) {}
}
