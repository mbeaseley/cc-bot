import { Command } from 'Utils/command';
import { CommandInteraction, TextChannel } from 'discord.js';
import { Discord, Slash, SlashOption } from 'discordx';

@Discord()
export abstract class Purge extends Command {
  /**
   * Purge Command
   * @param number
   * @param interaction
   */
  @Slash('purge', {
    description: `moderator command to delete up to 100 messages!`
  })
  async init(
    @SlashOption('number', {
      description: 'Number to delete (Limit is 100)',
      type: 'NUMBER'
    })
    number: number,
    interaction: CommandInteraction
  ): Promise<void> {
    try {
      const { channel } = interaction;

      if (number > 100) {
        await interaction.reply(this.c('purgeNumberError'));
        throw new Error();
      }

      const ch = channel?.isText() ? (channel as TextChannel) : undefined;

      await ch?.bulkDelete(number ?? 1, true);

      await interaction.reply(this.c('purgeSuccess'));
      await new Promise((resolve) => setTimeout(resolve, 3000));
      return interaction.deleteReply();
    } catch (e: unknown) {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      return interaction.deleteReply();
    }
  }
}
