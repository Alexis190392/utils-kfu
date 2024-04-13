import { Injectable } from '@nestjs/common';

type ChannelType = 0|2|4;
@Injectable()
export class ChannelDcService {
  async create([interaction],name:string, type: ChannelType, parentId?: string){

    if (!parentId)
      parentId = null;

    const channel = await interaction.guild.channels.create({
      name: name,
      type: type, // Puedes cambiarlo a (0 texto, 2 voz, 4 categoria)
      parent: parentId, //para categoria
    });

    return channel.id;

  }

  async editName([interaction] , channeId: string, name: string){
    const channel = await interaction.guild.channels.cache.get(channeId);

    await channel.edit({
      name: name,
    });
  }
}
