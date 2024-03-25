import { Injectable } from '@nestjs/common';

@Injectable()
export class Commons {

  encodeToBase64(data: string): string {
    return Buffer.from(data).toString('base64');
  }

  decodeFromBase64(base64Data: string): string {
    return Buffer.from(base64Data, 'base64').toString('utf-8');
  }
}
