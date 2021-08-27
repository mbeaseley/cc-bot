import { Command, CommandMessage } from '@typeit/discord';
import {
  Collection,
  Guild,
  GuildMember,
  Message,
  MessageEmbed,
  PresenceStatus,
  User,
} from 'discord.js';
import { Logger } from 'Root/services/logger.service';
import Utility from 'Root/utils/utility';
import dayjs from 'dayjs';

export class ServerInfo {
  private logger: Logger;

  constructor() {
    this.logger = new Logger();
  }

  private filterMembers(
    member: Collection<string, GuildMember>,
    status: PresenceStatus | 'bot' | 'human'
  ): number {
    return (
      ['bot', 'human'].indexOf(status) < 0
        ? member.filter((m) => m.presence.status === status)
        : member.filter((m) => (status === 'bot' ? m.user.bot : !m.user.bot))
    ).size;
  }

  private async createMessage(guild: Guild, user: User): Promise<MessageEmbed> {
    const member = guild.members.cache;
    const iconUrl = guild.iconURL() ?? '';
    const owner = member.find((m) => m.id === guild.ownerID)?.user.tag;
    const roles = [
      ...guild.roles.cache.sort((a, b) => b.position - a.position).values(),
    ];

    const fields = [
      { name: 'Server name:', value: `\`${guild.name}\``, inline: true },
      { name: 'Server owner:', value: `\`${owner}\``, inline: true },
      { name: 'Server ID:', value: `\`${guild.id}\``, inline: true },
      {
        name: 'Server created date:',
        value: dayjs(guild.createdAt).format('DD/MM/YYYY'),
        inline: true,
      },
      {
        name: 'Server region:',
        value: `\`${guild.region}\``,
        inline: true,
      },
      {
        name: 'Verification level:',
        value: `\`${guild.verificationLevel}\``,
        inline: true,
      },
      {
        name: `Member count ${guild.memberCount}:`,
        value: `\`${this.filterMembers(
          member,
          'online'
        )} online, ${this.filterMembers(
          member,
          'idle'
        )} idle and  ${this.filterMembers(
          member,
          'dnd'
        )} DnD \n ${this.filterMembers(
          member,
          'bot'
        )} bots, ${this.filterMembers(member, 'human')} humans\``,
        inline: true,
      },
      {
        name: 'Features:',
        value: `\`${
          guild.features.length === 0
            ? 'NONE'
            : guild.features.toString().toLowerCase().replace(/,/g, ', ')
        }\``,
        inline: true,
      },
      {
        name: `Roles ${guild.roles.cache.size}: `,
        value: `${roles.join(', ')}${
          roles.length != guild.roles.cache.size ? '...' : '.'
        }`,
        inline: true,
      },
    ];

    return new MessageEmbed()
      .setAuthor(`${guild.name}'s server info`, iconUrl)
      .setColor(3447003)
      .setThumbnail(iconUrl)
      .addFields(fields)
      .setTimestamp()
      .setFooter(`Requested by ${user.tag}`);
  }

  @Command('serverinfo')
  async init(command: CommandMessage): Promise<void | Message> {
    try {
      if (command.deletable) await command.delete();

      const msg = await Utility.sendMessage(
        command,
        '**:hourglass: Fetching Info...**'
      );

      if (!command.guild) {
        return;
      }

      const message = await this.createMessage(command.guild, command.author);
      await msg.delete();

      return command.channel.send(message);
    } catch (e: unknown) {
      if (command.deletable) await command.delete();
      this.logger.error(
        `Command: 'beam up' has error: ${(e as Error).message}.`
      );
      return Utility.sendMessage(
        command,
        `The following error has occurred: ${
          (e as Error).message
        }. If this error keeps occurring, please contact support.`,
        'channel',
        5000
      );
    }
  }
}
