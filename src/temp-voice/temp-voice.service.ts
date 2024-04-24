import { Injectable, Logger } from "@nestjs/common";
import { ChannelService, ModeratorService } from "../discord-bot/services";
import { Client, GuildBasedChannel, VoiceChannel, VoiceState } from "discord.js";
import { Repository } from "typeorm";
import { Channel } from "../discord-bot/entities";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class TempVoiceService {
  private readonly logger = new Logger('TempVoiceService');

  constructor(
    private readonly client: Client,
    private readonly moderatorService : ModeratorService,
    private readonly channelService : ChannelService,

    @InjectRepository(Channel)
    private readonly channelRepository : Repository<Channel>,

  ) {
    this.init();
  }
  async generate([interaction]) {

    const verify = this.moderatorService.verifyModerator([interaction])
    if (!verify)
      return interaction.reply({ content: "No tiene privilegios para este comando" });

    const guildId = await interaction.guild.id;

    let channel = await this.channelRepository.findOne({where:{guildId: guildId}});

    if (channel) {
      const channels = await interaction.guild.channels.fetch();

      let channelName =''
      for (const ch of channels) {
        if (ch[0] === channel.id){
          channelName= ch[1].name;
          break;
        }
      }
      return interaction.reply({ content: `El canal ya ha sido configurado en: \`\`\`${channelName}\`\`\`` });
    }

    const channelId = await this.channelService.createWithInteraction([interaction], 'TempVoice', 2);

    channel = new Channel();
    channel.id = channelId;
    channel.guildId = guildId;
    channel.name = 'TempVoice'
    channel.type = 'temp-voice';
    await this.channelRepository.save(channel);

    return interaction.reply({ content: `Se configuro correctamente en el canal: \`\`\`${channel.name}\`\`\`` });
  }

  async init() {
    this.client.once('ready', () => {
      this.logger.log("[     >>>   Bot is ready   <<<     ]");
    });

    let check = true;

    this.client.on('voiceStateUpdate', async (oldState: VoiceState, newState: VoiceState) => {
      let channelId = ""

      if (check){
        const guildId = newState.guild.id;
        const channel = await this.channelRepository.findOne({where:{guildId:guildId}})
        channelId = channel.id;
        check = false;
      }

      let oldChannel = oldState.channel;
      const newChannel = newState.channel;

      let newChannelId = "";
      let newVoiceChannel: GuildBasedChannel = oldState.channel;

      if (newChannel && newChannel.id === channelId && !oldChannel) {
        const guildId = newState.guild.id;

        newChannelId = await this.channelService.createWithClient(guildId, newState.member.displayName, 2, newChannel.parentId);

        newVoiceChannel = newState.guild.channels.cache.get(newChannelId);
        await newState.setChannel(newVoiceChannel as VoiceChannel);

      }
      check = true;

      if (oldChannel && oldChannel.id === newVoiceChannel.id && !newChannel) {
        await oldChannel.delete();
      }
    });
  }
}
