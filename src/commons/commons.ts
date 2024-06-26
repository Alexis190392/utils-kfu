import { Injectable } from "@nestjs/common";

@Injectable()
export class Commons {

  encodeToBase64(data: string): string {
    return Buffer.from(data).toString('base64');
  }

  decodeFromBase64(base64Data: string): string {
    return Buffer.from(base64Data, 'base64').toString('utf-8');
  }

  decodeParams(text: string): string {
    text = text.replace(/&nbsp;/g, ' ');
    text = text.replace(/&lt;/g, '<');
    text = text.replace(/&gt;/g, '>');
    text = text.replace(/><br>/g,'>');
    text = text.replace(/<br>>/g,';');
    text = text.replace(/<br>/g,'');


    return text;
  }

  splitLines(text: string): string[] {
    const lines= text.split(';');
    return lines.map(linea => linea.trim());
  }
}
