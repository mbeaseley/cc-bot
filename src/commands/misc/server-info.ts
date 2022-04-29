import { Command } from 'Utils/command';
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

@Discord()
export abstract class ServerInfo extends Command {
  /**
   * Get size of member proportion
   * @param member
   * @param status
   * @returns number
   */
  private filterMembers(
    member: Collection<string, GuildMember>,
    status: PresenceStatus | 'bot' | 'human'
  ): string {
    return (
      (['bot', 'human'].indexOf(status) < 0
        ? member.filter((m) => m.presence?.status === status)
        : member.filter((m) => (status === 'bot' ? m.user.bot : !m.user.bot))
      ).size.toString() ?? '~'
    );
  }

  /**
   * Create Message
   * @param guild
   * @param user
   * @returns Promise<MessageEmbed>
   */
  private async createMessage(guild: Guild, user: User): Promise<MessageEmbed> {
    const member = guild.members.cache;
    const iconURL = guild.iconURL() ?? '';
    const owner = member.find((m) => m.id === guild.ownerId)?.user.tag;
    const roles = [...guild.roles.cache.sort((a, b) => b.position - a.position).values()];

    const fields = [
      {
        name: this.c('serverName'),
        value: this.c('serverInsert', guild.name),
        inline: true
      },
      {
        name: this.c('serverOwner'),
        value: this.c('serverInsert', owner ?? '~'),
        inline: true
      },
      {
        name: this.c('serverId'),
        value: this.c('serverInsert', guild.id),
        inline: true
      },
      {
        name: this.c('serverDate'),
        value: dayjs(guild.createdAt).format('DD/MM/YYYY'),
        inline: true
      },
      {
        name: this.c('serverVerification'),
        value: this.c('serverInsert', guild.verificationLevel),
        inline: true
      },
      {
        name: this.c('serverCount', guild.memberCount.toString()),
        value: this.c(
          'serverCountValue',
          this.filterMembers(member, 'online'),
          this.filterMembers(member, 'idle'),
          this.filterMembers(member, 'dnd'),
          this.filterMembers(member, 'bot'),
          this.filterMembers(member, 'human')
        ),
        inline: true
      },
      {
        name: this.c('serverFeature'),
        value: `\`${
          guild.features.length === 0
            ? 'NONE'
            : guild.features.toString().toLowerCase().replace(/,/g, ', ')
        }\``,
        inline: true
      },
      {
        name: this.c('serverRoles', guild.roles.cache.size.toString()),
        value: `${roles.join(', ')}${roles.length != guild.roles.cache.size ? '...' : '.'}`,
        inline: true
      }
    ];

    return new MessageEmbed()
      .setAuthor({ name: this.c('serverAuthor', guild.name), iconURL })
      .setColor(3447003)
      .setThumbnail(iconURL)
      .addFields(fields)
      .setTimestamp()
      .setFooter({ text: this.c('serverRequest', user.username) });
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

    if (!guild || !member) {
      await interaction.reply(this.c('serverNoGuild'));
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return interaction.deleteReply();
    }

    const msg = await this.createMessage(guild, member.user as User);
    return interaction.reply({ embeds: [msg] });
  }
}
