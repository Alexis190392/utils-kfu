import { Injectable } from "@nestjs/common";
import { InjectDiscord } from "nestjs-discord-webhook";
import { WebhookClient } from "discord.js";

@Injectable()
export class WebhooksService {
  constructor(
    @InjectDiscord() private readonly discord: WebhookClient,
  ) {}

  async sendMessage(message: string): Promise<void> {
    try {
      if (message !== '')
        await this.discord.send(message);
    } catch (error) {
      console.error('Error al enviar el mensaje al webhook:', error);
    }
  }
}