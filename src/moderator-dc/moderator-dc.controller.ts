import { Controller } from '@nestjs/common';
import { ModeratorDcService } from './moderator-dc.service';

@Controller('moderator-dc')
export class ModeratorDcController {
  constructor(private readonly moderatorDcService: ModeratorDcService) {}
}
