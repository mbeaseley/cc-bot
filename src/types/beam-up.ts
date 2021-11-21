import { GuildChannel, GuildMember } from 'discord.js';

export class BeamUpItem {
  voiceChannel: GuildChannel | undefined;
  member: GuildMember | undefined;

  constructor(
    voiceChannel: GuildChannel | undefined,
    member: GuildMember | undefined
  ) {
    this.voiceChannel = voiceChannel;
    this.member = member;
  }
}
