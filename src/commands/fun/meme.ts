import { memeService } from 'Services/meme.service';
import { MemeItem } from 'Types/meme';
import { Command } from 'Utils/command';
import { ClientUser, CommandInteraction, MessageEmbed } from 'discord.js';
import { Discord, Slash } from 'discordx';

@Discord()
export abstract class Insult extends Command {
  constructor() {
    super();
  }

  /**
   * Create Message for meme command
   * @param meme
   * @param user
   * @returns MessageEmbed
   */
  private createMessage(meme: MemeItem, user: ClientUser | null): MessageEmbed {
    return new MessageEmbed()
      .setAuthor({ name: this.c('memeTitle'), iconURL: user?.displayAvatarURL() })
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
    const meme = await memeService.getMeme();

    if (!meme?.image) {
      await interaction.reply(this.c('noMeme'));
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return interaction.deleteReply();
    }

    const msg = this.createMessage(meme, interaction.client.user);
    return interaction.reply({ embeds: [msg] });
  }
}
