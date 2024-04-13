import { Controller } from '@nestjs/common';
import { MemberDcService } from './member-dc.service';

@Controller('member-dc')
export class MemberDcController {
  constructor(private readonly memberDcService: MemberDcService) {}
}
