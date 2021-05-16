import {
  GuildMember,
  Message,
  PartialGuildMember,
  TextChannel,
} from 'discord.js';

export class MemberRemove {
  async init(
    member: GuildMember | PartialGuildMember
  ): Promise<Message | void> {
    const { guild } = member;
    let channel = guild.channels.cache.get('838575359724224596');

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
