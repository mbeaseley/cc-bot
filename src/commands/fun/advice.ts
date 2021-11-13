import { CommandInteraction, MessageEmbed } from 'discord.js';
import { Discord, Slash, SlashOption } from 'discordx';
import { AdviceService } from '../../services/advice.service';

@Discord()
export abstract class Advice {
  private adviceService: AdviceService;

  constructor() {
    this.adviceService = new AdviceService();
  }

  /**
   * Create Message for advice command
   * @param advice
   * @returns MessageEmbed
   */
  private createMessage(advice: string): MessageEmbed {
    return new MessageEmbed()
      .setTitle('Advice Command')
      .setColor('RANDOM')
      .setDescription(advice);
  }

  /**
   * Advice Command
   * @param user
   * @param interaction
   */
  @Slash('advice')
  async init(
    @SlashOption('user', {
      description: 'Who do you want to send advice to?',
    })
    user: string,
    interaction: CommandInteraction
  ): Promise<void> {
    const { advice } = await this.adviceService.getAdvice();

    if (!advice) {
      await interaction.reply('**No advice was given!**');
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return interaction.deleteReply();
    }

    const adviceString = user ? `${user}, ${advice}` : advice;
    const msg = this.createMessage(adviceString);
    return interaction.reply({ embeds: [msg] });
  }
}
