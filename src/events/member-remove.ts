import { Command } from 'Utils/command';
import { environment } from 'Utils/environment';
import { GuildMember, Message, PartialGuildMember, TextChannel } from 'discord.js';
import { ArgsOf, Discord, On } from 'discordx';

@Discord()
export abstract class memberRemove extends Command {
  /**
   * Handle leaving member
   * @param member
   * @returns Promise<Message>
   */
  private async handleRemoval(member: GuildMember | PartialGuildMember): Promise<Message | void> {
    const { memberRemove } = environment;

    if (!memberRemove) {
      return Promise.resolve();
    }

    const { guild } = member;
    const channel = guild.channels.cache.get(memberRemove);

    if (!channel) {
      return Promise.resolve();
    }

    if (!((channel): channel is TextChannel => channel.type === 'GUILD_TEXT')(channel)) {
      return Promise.resolve();
    }

    if (!member?.user) {
      return Promise.reject();
    }

    return channel.send(this.c('memberRemoveLeft', member.user?.username as string));
  }

  /**
   * guildMemberAdd event
   * @param guildMember
   */
  @On('guildMemberRemove')
  async init([guildMember]: ArgsOf<'guildMemberRemove'>): Promise<Message | void> {
    return this.handleRemoval(guildMember);
  }
}
