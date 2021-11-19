import { CommandInteraction, TextChannel } from 'discord.js';
import { Discord, Permission, Slash, SlashOption } from 'discordx';
import { environment } from '../../utils/environment';

@Discord()
@Permission(false)
@Permission({
  id: environment.moderatorRoles[0],
  type: 'ROLE',
  permission: true,
})
export abstract class Purge {
  /**
   * Purge Command
   * @param number
   * @param interaction
   */
  @Slash('purge', {
    description: `Delete up to 100 messages!\nCommand: /purge number(optional)`,
  })
  async init(
    @SlashOption('number', {
      description: 'Number to delete (Limit is 100)',
      type: 'NUMBER',
    })
    number: number,
    interaction: CommandInteraction
  ): Promise<void> {
    if (number > 100) {
      await interaction.reply('**Please add a number less than 101!**');
      await new Promise((resolve) => setTimeout(resolve, 3000));
      return interaction.deleteReply();
    }

    const channel = interaction.channel?.isText()
      ? (interaction.channel as TextChannel)
      : undefined;

    await channel?.bulkDelete(number ?? 1, true);

    await interaction.reply('**Deleted Messages!**');
    await new Promise((resolve) => setTimeout(resolve, 3000));
    return interaction.deleteReply();
  }
}
