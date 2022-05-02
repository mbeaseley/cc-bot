import { Command } from 'Utils/command';
import { ClientUser, CommandInteraction, MessageEmbed } from 'discord.js';
import { Discord, Slash, SlashGroup } from 'discordx';

@Discord()
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
  @Slash('with-no-role', {
    description: 'moderator command to find all members with no roles assigned'
  })
  async noRoleInit(interaction: CommandInteraction): Promise<void> {
    try {
      const { client, guild } = interaction;

      if (!guild) {
        await interaction.reply(this.c('unexpectedError'));
        throw new Error();
      }

      const members = guild.members.cache
        .map((m) => (m.roles.cache.size === 1 ? m.nickname ?? m.user.username : undefined))
        .filter(Boolean);

      const noRoleMsg = members.length
        ? this.c('membersWithoutRole', members.join(', '))
        : this.c('noMembersWithoutRole');

      const msg = this.createMessage(this.c('noRoleTitle'), client.user, noRoleMsg);
      return interaction.reply({ embeds: [msg] });
    } catch (e: unknown) {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return interaction.deleteReply();
    }
  }
}
