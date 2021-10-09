import { Command, CommandMessage, Description } from '@typeit/discord';
import { Logger } from 'Services/logger.service';
import Translate from 'Utils/translate';
import Utility from 'Utils/utility';
import dayjs from 'dayjs';
import {
  Collection,
  Guild,
  GuildMember,
  Message,
  MessageEmbed,
  PresenceStatus,
  User,
} from 'discord.js';

export class ServerInfo {
  private logger: Logger;

  constructor() {
    this.logger = new Logger();
  }

  /**
   * Get size of member proportion
   * @param member
   * @param status
   * @returns number
   */
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

  /**
   * Create Message
   * @param guild
   * @param user
   * @returns Promise<MessageEmbed>
   */
  private async createMessage(guild: Guild, user: User): Promise<MessageEmbed> {
    const member = guild.members.cache;
    const iconUrl = guild.iconURL() ?? '';
    const owner = member.find((m) => m.id === guild.ownerID)?.user.tag;
    const roles = [
      ...guild.roles.cache.sort((a, b) => b.position - a.position).values(),
    ];

    const fields = [
      {
        name: Translate.find('serverName'),
        value: `\`${guild.name}\``,
        inline: true,
      },
      {
        name: Translate.find('serverOwner'),
        value: `\`${owner}\``,
        inline: true,
      },
      {
        name: Translate.find('serverId'),
        value: `\`${guild.id}\``,
        inline: true,
      },
      {
        name: Translate.find('serverDate'),
        value: dayjs(guild.createdAt).format('DD/MM/YYYY'),
        inline: true,
      },
      {
        name: Translate.find('serverRegion'),
        value: `\`${guild.region}\``,
        inline: true,
      },
      {
        name: Translate.find('serverVerification'),
        value: `\`${guild.verificationLevel}\``,
        inline: true,
      },
      {
        name: Translate.find('serverCount', guild.memberCount.toString()),
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
        name: Translate.find('serverFeature'),
        value: `\`${
          guild.features.length === 0
            ? 'NONE'
            : guild.features.toString().toLowerCase().replace(/,/g, ', ')
        }\``,
        inline: true,
      },
      {
        name: Translate.find('serverRoles', guild.roles.cache.size.toString()),
        value: `${roles.join(', ')}${
          roles.length != guild.roles.cache.size ? '...' : '.'
        }`,
        inline: true,
      },
    ];

    return new MessageEmbed()
      .setAuthor(Translate.find('serverAuthor', guild.name), iconUrl)
      .setColor(3447003)
      .setThumbnail(iconUrl)
      .addFields(fields)
      .setTimestamp()
      .setFooter(Translate.find('serverRequest', user.tag));
  }

  /**
   * Init
   * @param command
   */
  @Command('serverinfo')
  @Description('Get server info')
  async init(command: CommandMessage): Promise<void | Message> {
    try {
      if (command.deletable) await command.delete();

      const msg = await Utility.sendMessage(
        command,
        Translate.find('serverFetch')
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
        Translate.find('errorLog', 'serverinfo', (e as Error).message)
      );
      return Utility.sendMessage(
        command,
        Translate.find('errorDefault', (e as Error).message),
        'channel',
        5000
      );
    }
  }
}
