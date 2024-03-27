import { Injectable } from '@nestjs/common';

@Injectable()
export class Commons {

  encodeToBase64(data: string): string {
    return Buffer.from(data).toString('base64');
  }

  decodeFromBase64(base64Data: string): string {
    return Buffer.from(base64Data, 'base64').toString('utf-8');
  }

  decodeParams(texto: string): string {
    texto = texto.replace(/&nbsp;/g, ' ');
    texto = texto.replace(/&gt;/g, '>');
    texto = texto.replace(/&lt;/g, '<');

    return texto;
  }

  splitLines(text: string): string[] {
    const lines= text.split('<br>');
    const linesWhitoutSpaces = lines.map(linea => linea.trim());

    return linesWhitoutSpaces;
  }
}
