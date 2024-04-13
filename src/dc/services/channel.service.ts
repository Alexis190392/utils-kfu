
type ChannelType = 0|2|4;
export class ChannelService{

  async create([interaction],name:string, type: ChannelType, parentId?: string){

    if (!parentId)
      parentId = null;

    await interaction.guild.channels.create({
      name: name,
      type: type, // Puedes cambiarlo a (0 texto, 2 voz, 4 categoria)
      parent: parentId, //para categoria
    });

  }

  async editName([interaction] , channeId: string, name: string){
    const channel = await interaction.guild.channels.cache.get(channeId);

    await channel.edit({
      name: name,
    });
  }

}