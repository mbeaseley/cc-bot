import { environment } from 'Utils/environment';
import Translate from 'Utils/translate';
import { GuildMember, Message, PartialGuildMember, TextChannel } from 'discord.js';
import { ArgsOf, Discord, On } from 'discordx';

@Discord()
export abstract class memberRemove {
  /**
   * Handle leaving member
   * @param member
   * @returns Promise<Message>
   */
  private async handleRemoval(member: GuildMember | PartialGuildMember): Promise<Message | void> {
    const { guild } = member;
    const channel = guild.channels.cache.get(environment.memberRemove);

    if (!channel) {
      return Promise.resolve();
    }

    if (!((channel): channel is TextChannel => channel.type === 'GUILD_TEXT')(channel)) {
      return Promise.resolve();
    }

    if (!member?.user) {
      return Promise.reject();
    }

    return channel.send(Translate.find('memberRemoveLeft', member.user?.username as string));
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
