export class ChannelService{
  private channel: any;

  async create([interaction],name:string, type: number, parentId?: string){

    if (!parentId)
      parentId = null;

    await interaction.guild.channels.create({
      name: name,
      type: type, // Puedes cambiarlo a (0 texto, 2 voz, 4 categoria)
      parentId: parentId, //para categoria

    });

  }

  async editName([interaction], name: string){
    await this.channel.edit({
      name: name ,
    });
  }

}