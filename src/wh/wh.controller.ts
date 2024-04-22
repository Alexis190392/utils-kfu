import { Controller } from '@nestjs/common';
import { WhService } from './wh.service';

@Controller('wh')
export class WhController {
  constructor(private readonly whService: WhService) {}
}
