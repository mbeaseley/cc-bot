import { ClientUser, CommandInteraction, MessageEmbed } from 'discord.js';
import { Discord, Slash } from 'discordx';
import { AnimalsService } from '../../services/animal.service';

@Discord()
export abstract class Panda {
  private animalService: AnimalsService;

  constructor() {
    this.animalService = new AnimalsService();
  }

  /**
   * Create Message for panda command
   * @param advice
   * @returns MessageEmbed
   */
  private createMessage(panda: string, user: ClientUser | null): MessageEmbed {
    return new MessageEmbed()
      .setAuthor('Panda Command', user?.displayAvatarURL())
      .setColor('RANDOM')
      .setImage(panda);
  }

  /**
   * Panda Command
   * @param user
   * @param interaction
   */
  @Slash('panda', {
    description: `Image of a panda?`,
  })
  async init(interaction: CommandInteraction): Promise<void> {
    const { link } = await this.animalService.getPanda();

    if (!link) {
      await interaction.reply('**No panda was given!**');
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return interaction.deleteReply();
    }

    const msg = this.createMessage(link, interaction.client.user);
    return interaction.reply({ embeds: [msg] });
  }
}
