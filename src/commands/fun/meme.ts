import { CommandInteraction, MessageEmbed } from 'discord.js';
import { Discord, Slash } from 'discordx';
import { MemeService } from '../../services/meme.service';
import { MemeItem } from '../../types/meme';

@Discord()
export abstract class Insult {
  private memeService: MemeService;

  constructor() {
    this.memeService = new MemeService();
  }

  /**
   * Create Message for meme command
   * @param advice
   * @returns MessageEmbed
   */
  private createMessage(meme: MemeItem): MessageEmbed {
    return new MessageEmbed()
      .setTitle('Meme Command')
      .setColor('RANDOM')
      .setDescription(meme.caption ?? '')
      .setImage(meme.image ?? '');
  }

  /**
   * Insult Command
   * @param user
   * @param interaction
   */
  @Slash('meme')
  async init(interaction: CommandInteraction): Promise<void> {
    const meme = await this.memeService.getMeme();

    if (!meme.image) {
      await interaction.reply('**No meme was given!**');
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return interaction.deleteReply();
    }

    const msg = this.createMessage(meme);
    return interaction.reply({ embeds: [msg] });
  }
}
