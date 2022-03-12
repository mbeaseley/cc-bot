import { hasPermission } from 'Guards/has-permission';
import { Command } from 'Utils/command';
import { environment } from 'Utils/environment';
import { CommandInteraction, TextChannel } from 'discord.js';
import { Discord, Permission, Slash, SlashOption } from 'discordx';

@Discord()
@Permission(false)
@Permission(hasPermission(environment.moderatorRoles))
export abstract class Purge extends Command {
  /**
   * Purge Command
   * @param number
   * @param interaction
   */
  @Slash('purge', {
    description: `Delete up to 100 messages!`
  })
  async init(
    @SlashOption('number', {
      description: 'Number to delete (Limit is 100)',
      type: 'NUMBER'
    })
    number: number,
    interaction: CommandInteraction
  ): Promise<void> {
    if (number > 100) {
      await interaction.reply(this.c('purgeNumberError'));
      await new Promise((resolve) => setTimeout(resolve, 3000));
      return interaction.deleteReply();
    }

    const channel = interaction.channel?.isText()
      ? (interaction.channel as TextChannel)
      : undefined;

    await channel?.bulkDelete(number ?? 1, true);

    await interaction.reply(this.c('purgeSuccess'));
    await new Promise((resolve) => setTimeout(resolve, 3000));
    return interaction.deleteReply();
  }
}
