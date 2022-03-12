import { Command } from 'Utils/command';
import {
  CategoryChannel,
  ClientUser,
  GuildMember,
  MessageEmbed,
  VoiceChannel,
  VoiceState
} from 'discord.js';
import { ArgsOf, Discord, On } from 'discordx';

const VOICE_CHANNEL_TEXT = 'Join To Create Channel';
const BASE_VOICE_CHANNEL_NAME = '『📢』Chatting (';

@Discord()
export class CreateVoiceChannel extends Command {
  constructor() {
    super();
  }

  /**
   * Get voice channels numbers only
   * @param channel
   * @returns number[]
   */
  private getVoiceChannelNumbers(channel?: CategoryChannel): number[] {
    return (
      channel?.children
        .filter((c) => c.isVoice() && /\d/.test(c.name))
        .map((c) => parseInt(c.name.replace(/[^0-9]/g, ''))) ?? []
    ).sort();
  }

  private createChannel(channel: CategoryChannel, voiceChannels: number[]): Promise<VoiceChannel> {
    const { length } = voiceChannels;
    return channel.createChannel(
      BASE_VOICE_CHANNEL_NAME + `${length ? voiceChannels[length - 1] + 1 : 1}` + ')',
      {
        type: 'GUILD_VOICE'
      }
    );
  }

  /**
   * Create default error message
   * @param user
   * @returns MessageEmbed
   */
  createErrorMessage(user: ClientUser | null): MessageEmbed {
    return new MessageEmbed()
      .setAuthor({ name: this.c('voiceChannelErrorTitle'), iconURL: user?.displayAvatarURL() })
      .setColor('DARK_RED')
      .setDescription(this.c('voiceChannelDescription'));
  }

  /**
   * Create new channel and set member voice channel to that channel
   * @param state
   * @returns Promise<GuildMember | void>
   */
  async createAndSetVoiceChannel(state: VoiceState): Promise<GuildMember | void> {
    const categoryChannel = state.channel?.parent;

    if (!categoryChannel) {
      const member = await state.member?.fetch();
      const dmChannel = await member?.createDM(true);
      const msg = this.createErrorMessage(state.client.user);
      await dmChannel?.send({ embeds: [msg] });

      return member?.voice.disconnect() ?? Promise.resolve();
    }

    const voiceChannels = this.getVoiceChannelNumbers(categoryChannel ?? undefined);

    return this.createChannel(categoryChannel, voiceChannels).then((v) => {
      const member = state.channel?.members.first();

      if (member) {
        return member.voice.setChannel(v);
      }
    });
  }

  @On('voiceStateUpdate')
  async init([oldState, newState]: ArgsOf<'voiceStateUpdate'>): Promise<any> {
    if (newState?.channel?.name === VOICE_CHANNEL_TEXT) {
      return this.createAndSetVoiceChannel(newState);
    }

    if (oldState?.channel?.name.includes(BASE_VOICE_CHANNEL_NAME)) {
      const voiceChannel = await oldState.channel.fetch();
      const members = voiceChannel.members.size;

      if (!members) {
        return voiceChannel.delete();
      }
    }
  }
}
