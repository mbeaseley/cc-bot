import {
  GuildMember,
  Message,
  PartialGuildMember,
  TextChannel,
} from 'discord.js';
import { environment } from '../utils/environment';

export class MemberRemove {
  async init(
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
}
