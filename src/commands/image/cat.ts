import { ClientUser, CommandInteraction, MessageEmbed } from 'discord.js';
import { Discord, Slash } from 'discordx';
import { AnimalsService } from '../../services/animal.service';

@Discord()
export abstract class Cat {
  private animalService: AnimalsService;

  constructor() {
    this.animalService = new AnimalsService();
  }

  /**
   * Create Message for cats command
   * @param advice
   * @returns MessageEmbed
   */
  private createMessage(cat: string, user: ClientUser | null): MessageEmbed {
    return new MessageEmbed()
      .setAuthor('Cat Command', user?.displayAvatarURL())
      .setColor('RANDOM')
      .setImage(cat);
  }

  /**
   * Cats Command
   * @param user
   * @param interaction
   */
  @Slash('cat', {
    description: `Image of a cat?\nCommand: /cat`,
  })
  async init(interaction: CommandInteraction): Promise<void> {
    const { link } = await this.animalService.getCat();

    if (!link) {
      await interaction.reply('**No cat was given!**');
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return interaction.deleteReply();
    }

    const msg = this.createMessage(link, interaction.client.user);
    return interaction.reply({ embeds: [msg] });
  }
}
