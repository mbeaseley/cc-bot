import { Client } from '@typeit/discord';
import {
  GuildMember,
  Message,
  PartialGuildMember,
  TextChannel,
} from 'discord.js';
import { environment } from 'Utils/environment';

export class MemberRemove {
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
