import { Injectable } from "@nestjs/common";
import { createCanvas, loadImage, SKRSContext2D } from "@napi-rs/canvas";
import axios from "axios";
import { AttachmentBuilder } from "discord.js";

type EventType = 'steam'|'birthday'|'newMember';
@Injectable()
export class BannerService {

  async test([interaction]) {

    const backgroundImageURL = 'https://cdn.discordapp.com/attachments/1201023027236847677/1233945277753331722/Default_wallpaper_with_dark_and_yellow_postapocalyptic_abstrac_0.jpg?ex=662ef097&is=662d9f17&hm=c7b8b5087b3471e030a472a7fe5c0966f0f1d671f1ce9d3c4847df74ea1c70bd&';

    const message = '¡Aquí tienes el mensaje sobre la imagen! ';

    // Obtener el usuario que inició la interacción
    const member = await interaction.member;
    const userName = member.nickname;

    const avatarURL = member.user.displayAvatarURL({ size: 1024, dynamic: true });

    const canvasImage = await this.createCanvas(backgroundImageURL,avatarURL,message,userName)

    await interaction.reply({ files: [canvasImage] });
  }


  async createCanvas(backgroundUrl:string , avatarUrl:string, message:string, subMessage?: string, event?:EventType){

    const background = await this.loadImageFromURL(backgroundUrl);
    const avatar = await this.loadImageFromURL(avatarUrl);

    const canvas = createCanvas(background.width, background.height);
    const ctx: SKRSContext2D = canvas.getContext('2d');

    //background
    ctx.drawImage(background, 0, 0, background.width, canvas.height);
    ctx.save();

    //calcular radio del circulo
    const avatarRadius = background.width * 0.15;
    ctx.beginPath();
    ctx.arc(background.width*0.5, background.height*0.3,avatarRadius, 0, Math.PI * 2, true); // Definir el círculo para recortar el avatar
    ctx.closePath();
    ctx.clip();

    const avatarSize = avatarRadius*2;
    ctx.drawImage(avatar,background.width*0.5 - avatarSize/2,background.height*0.3 - avatarSize/2, avatarSize, avatarSize );

    // Dibujar borde con gradiente
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0); // Crear gradiente lineal
    gradient.addColorStop(0, '#ff0000'); // Color inicial
    gradient.addColorStop(1, '#ffff00'); // Color final

    //dibujar borde
    // ctx.strokeStyle= '#ffaa00';
    ctx.strokeStyle= gradient;
    ctx.lineWidth = background.width*0.015;
    ctx.stroke();

    ctx.restore();

    //message level 1
    const titleFontSize = background.width * 0.05;
    ctx.font = `${titleFontSize}px Arial`;

    ctx.fillStyle = '#ffffff';
    ctx.textAlign = "center";
    ctx.fillText(message,canvas.width/2,background.height*0.75)

    //message level 2
   if (subMessage){
     const messageFontSize = background.width * 0.05;
     ctx.font = `${messageFontSize}px Arial`;

     ctx.fillStyle = '#ffffff';
     ctx.textAlign = "center";
     ctx.fillText(subMessage,canvas.width/2,background.height*0.85)
   }

   return new AttachmentBuilder(canvas.toBuffer("image/png"), { name: 'image.jpg' });

  }

  private async loadImageFromURL(url: string) {
    try {
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      const imageBuffer = Buffer.from(response.data, 'binary');
      const image = await loadImage(imageBuffer);
      return image;
    } catch (error) {
      console.error('Error al cargar la imagen:', error);
      throw new Error('No se pudo cargar la imagen.');
    }
  }

}
