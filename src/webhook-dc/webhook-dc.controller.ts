import { Controller } from '@nestjs/common';
import { WebhookDcService } from './webhook-dc.service';

@Controller('webhook-dc')
export class WebhookDcController {
  constructor(private readonly webhookDcService: WebhookDcService) {}
}
