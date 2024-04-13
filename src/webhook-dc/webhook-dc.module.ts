import { Module } from '@nestjs/common';
import { WebhookDcService } from './webhook-dc.service';
import { WebhookDcController } from './webhook-dc.controller';

@Module({
  controllers: [WebhookDcController],
  providers: [WebhookDcService],
})
export class WebhookDcModule {}
