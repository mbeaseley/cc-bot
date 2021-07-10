import { Client } from '@typeit/discord';
import { environment } from 'Utils/environment';
import {
  GuildMember,
  Message,
  PartialGuildMember,
  TextChannel,
} from 'discord.js';

export class MemberRemove {
  /**
   * Handle leaving member
   * @param member
   * @returns Promise<Message>
   */
  private async handleRemoval(
    member: GuildMember | PartialGuildMember
  ): Promise<Message | void> {
    const { guild } = member;
    let channel = guild.channels.cache.get(environment.memberRemove);

    if (!channel) {
      return Promise.resolve();
    }

    if (
      !((channel): channel is TextChannel => channel.type === 'text')(channel)
    ) {
      return Promise.resolve();
    }

    if (!member?.user) {
      return Promise.reject();
    }

    return channel.send(
      `:wave: **${member.user?.username}** has left this server!`
    );
  }

  /**
   * Init for member added
   * @param client
   */
  public init(client: Client): void {
    client.on('guildMemberRemove', (member) => this.handleRemoval(member));
  }
}
