import { hasPermission } from 'Guards/has-permission';
import { Command } from 'Utils/command';
import { environment } from 'Utils/environment';
import { ClientUser, CommandInteraction, MessageEmbed } from 'discord.js';
import { Discord, Permission, Slash, SlashGroup } from 'discordx';

@Discord()
@Permission(false)
@Permission({
  id: environment.ownerId,
  type: 'USER',
  permission: true
})
@Permission(hasPermission(environment.moderatorRoles))
@SlashGroup({ name: 'member', description: 'Query members based on role' })
@SlashGroup('member')
export class Members extends Command {
  constructor() {
    super();
  }

  /**
   * Create message
   * @param title
   * @param user
   * @param message
   * @returns MessageEmbed
   */
  private createMessage(title: string, user: ClientUser | null, message: string): MessageEmbed {
    return new MessageEmbed()
      .setAuthor({ name: title, iconURL: user?.displayAvatarURL() })
      .setColor('RANDOM')
      .setDescription(message);
  }

  /**
   *
   * @param interaction
   * @returns
   */
  @Slash('with-no-role')
  async noRoleInit(interaction: CommandInteraction): Promise<void> {
    const { client, guild } = interaction;

    if (!guild) {
      await interaction.reply(this.c('unexpectedError'));
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return interaction.deleteReply();
    }

    const members = guild.members.cache
      .map((m) => (m.roles.cache.size === 1 ? m.nickname ?? m.user.username : undefined))
      .filter(Boolean);

    const noRoleMsg = members.length
      ? this.c('membersWithoutRole', members.join(', '))
      : this.c('noMembersWithoutRole');

    const msg = this.createMessage(this.c('noRoleTitle'), client.user, noRoleMsg);
    return interaction.reply({ embeds: [msg] });
  }
}
