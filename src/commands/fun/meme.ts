import { ClientUser, CommandInteraction, MessageEmbed } from 'discord.js';
import { Discord, Slash } from 'discordx';
import { MemeService } from 'Services/meme.service';
import { MemeItem } from 'Types/meme';

@Discord()
export abstract class Insult {
  private memeService: MemeService;

  constructor() {
    this.memeService = new MemeService();
  }

  /**
   * Create Message for meme command
   * @param meme
   * @param user
   * @returns MessageEmbed
   */
  private createMessage(meme: MemeItem, user: ClientUser | null): MessageEmbed {
    return new MessageEmbed()
      .setAuthor('Meme Command', user?.displayAvatarURL())
      .setColor('RANDOM')
      .setDescription(meme.caption ?? '')
      .setImage(meme.image ?? '');
  }

  /**
   * Insult Command
   * @param user
   * @param interaction
   */
  @Slash('meme', { description: `Want a bad meme?` })
  async init(interaction: CommandInteraction): Promise<void> {
    const meme = await this.memeService.getMeme();

    if (!meme.image) {
      await interaction.reply('**No meme was given!**');
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return interaction.deleteReply();
    }

    const msg = this.createMessage(meme, interaction.client.user);
    return interaction.reply({ embeds: [msg] });
  }
}
