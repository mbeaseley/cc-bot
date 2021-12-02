import dayjs = require('dayjs');
import {
  Collection,
  CommandInteraction,
  Guild,
  GuildMember,
  MessageEmbed,
  PresenceStatus,
  User
} from 'discord.js';
import { Discord, Slash } from 'discordx';
import Translate from 'Utils/translate';

@Discord()
export abstract class ServerInfo {
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
        ? member.filter((m) => m.presence?.status === status)
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
    const owner = member.find((m) => m.id === guild.ownerId)?.user.tag;
    const roles = [...guild.roles.cache.sort((a, b) => b.position - a.position).values()];

    const fields = [
      {
        name: Translate.find('serverName'),
        value: `\`${guild.name}\``,
        inline: true
      },
      {
        name: Translate.find('serverOwner'),
        value: `\`${owner}\``,
        inline: true
      },
      {
        name: Translate.find('serverId'),
        value: `\`${guild.id}\``,
        inline: true
      },
      {
        name: Translate.find('serverDate'),
        value: dayjs(guild.createdAt).format('DD/MM/YYYY'),
        inline: true
      },
      {
        name: Translate.find('serverVerification'),
        value: `\`${guild.verificationLevel}\``,
        inline: true
      },
      {
        name: Translate.find('serverCount', guild.memberCount.toString()),
        value: `\`${this.filterMembers(member, 'online')} online, ${this.filterMembers(
          member,
          'idle'
        )} idle and  ${this.filterMembers(member, 'dnd')} DnD \n ${this.filterMembers(
          member,
          'bot'
        )} bots, ${this.filterMembers(member, 'human')} humans\``,
        inline: true
      },
      {
        name: Translate.find('serverFeature'),
        value: `\`${
          guild.features.length === 0
            ? 'NONE'
            : guild.features.toString().toLowerCase().replace(/,/g, ', ')
        }\``,
        inline: true
      },
      {
        name: Translate.find('serverRoles', guild.roles.cache.size.toString()),
        value: `${roles.join(', ')}${roles.length != guild.roles.cache.size ? '...' : '.'}`,
        inline: true
      }
    ];

    return new MessageEmbed()
      .setAuthor(Translate.find('serverAuthor', guild.name), iconUrl)
      .setColor(3447003)
      .setThumbnail(iconUrl)
      .addFields(fields)
      .setTimestamp()
      .setFooter(Translate.find('serverRequest', user.username));
  }

  /**
   * Server info command
   * @param interaction
   */
  @Slash('server-info', {
    description: 'Get to know this server.'
  })
  async init(interaction: CommandInteraction): Promise<void> {
    const { guild, member } = interaction;

    if (!guild) {
      await interaction.reply('**No guild was found!**');
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return interaction.deleteReply();
    }

    const msg = await this.createMessage(guild, member.user as User);
    return interaction.reply({ embeds: [msg] });
  }
}
