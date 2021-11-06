import { GuildMember } from 'discord.js';

export class ModerationService {
  constructor() {}

  /**
   * Set active member deafen state
   * @param member
   * @param value
   */
  setDeaf(member: GuildMember, value: boolean): Promise<GuildMember> {
    return member.voice.setDeaf(value);
  }

  /**
   * Set active member mute state
   * @param member
   * @param value
   */
  setMute(member: GuildMember, value: boolean): Promise<GuildMember> {
    return member.voice.setMute(value);
  }
}
