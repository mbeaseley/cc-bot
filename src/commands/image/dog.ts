import { ClientUser, CommandInteraction, MessageEmbed } from 'discord.js';
import { Discord, Slash } from 'discordx';
import { AnimalsService } from '../../services/animal.service';

@Discord()
export abstract class Dog {
  private animalService: AnimalsService;

  constructor() {
    this.animalService = new AnimalsService();
  }

  /**
   * Create Message for dog command
   * @param advice
   * @returns MessageEmbed
   */
  private createMessage(dog: string, user: ClientUser | null): MessageEmbed {
    return new MessageEmbed()
      .setAuthor('Dog Command', user?.displayAvatarURL())
      .setColor('RANDOM')
      .setImage(dog);
  }

  /**
   * Dog Command
   * @param user
   * @param interaction
   */
  @Slash('dog', {
    description: `Image of a dog?`,
  })
  async init(interaction: CommandInteraction): Promise<void> {
    const { link } = await this.animalService.getDog();

    if (!link) {
      await interaction.reply('**No dog was given!**');
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return interaction.deleteReply();
    }

    const msg = this.createMessage(link, interaction.client.user);
    return interaction.reply({ embeds: [msg] });
  }
}
