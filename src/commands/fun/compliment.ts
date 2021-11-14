import { CommandInteraction, MessageEmbed } from 'discord.js';
import { Discord, Slash, SlashOption } from 'discordx';
import { ComplimentService } from '../../services/compliment.service';

@Discord()
export abstract class Compliment {
  private complimentService: ComplimentService;

  constructor() {
    this.complimentService = new ComplimentService();
  }

  /**
   * Create Message for advice command
   * @param advice
   * @returns MessageEmbed
   */
  private createMessage(compliment: string): MessageEmbed {
    return new MessageEmbed()
      .setTitle('Compliment Command')
      .setColor('RANDOM')
      .setDescription(compliment);
  }

  /**
   * Compliment Command
   * @param user
   * @param interaction
   */
  @Slash('compliment')
  async init(
    @SlashOption('user', {
      description: 'Who do you want to send advice to?',
    })
    user: string,
    interaction: CommandInteraction
  ): Promise<void> {
    const { compliment } = await this.complimentService.getCompliment();

    if (!compliment) {
      await interaction.reply('**No compliment was given!**');
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return interaction.deleteReply();
    }

    const complimentString = user ? `${user}, ${compliment}` : compliment;
    const msg = this.createMessage(complimentString);
    return interaction.reply({ embeds: [msg] });
  }
}
