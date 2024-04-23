import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class Commons {
  private readonly logger = new Logger('Commons');
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
    if (text.includes(';')) {
      const lines = text.split(";");
      return lines.map(linea => linea.trim());
    } else {
      return [text];
    }
  }

  decimalToHex(decimal){

    try {
      let hex = decimal.toString(16).toUpperCase();
      return  hex.padStart(6, '0');
    } catch (e){
      this.logger.warn(`${e.message} - Set default #D8D8D8`)
      return  '#D8D8D8';
    }

  }
}
