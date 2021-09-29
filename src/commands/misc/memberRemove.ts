import { Client } from '@typeit/discord';
import { environment } from 'Utils/environment';
import Translate from 'Utils/translate';
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
    const channel = guild.channels.cache.get(environment.memberRemove);

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
      Translate.find('memberRemoveLeft', member.user?.username as string)
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
