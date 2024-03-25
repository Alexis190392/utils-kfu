import { PartialType } from '@nestjs/mapped-types';
import { CreateWebadminDto } from './create-webadmin.dto';

export class UpdateWebadminDto extends PartialType(CreateWebadminDto) {}
