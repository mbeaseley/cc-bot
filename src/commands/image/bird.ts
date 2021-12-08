import { AnimalsService } from 'Services/animal.service';
import { ClientUser, CommandInteraction, MessageEmbed } from 'discord.js';
import { Discord, Slash } from 'discordx';

@Discord()
export abstract class Bird {
  private animalService: AnimalsService;

  constructor() {
    this.animalService = new AnimalsService();
  }

  /**
   * Create Message for bird command
   * @param bird
   * @param user
   * @returns MessageEmbed
   */
  private createMessage(bird: string, user: ClientUser | null): MessageEmbed {
    return new MessageEmbed()
      .setAuthor('Bird Command', user?.displayAvatarURL())
      .setColor('RANDOM')
      .setImage(bird);
  }

  /**
   * Bird Command
   * @param user
   * @param interaction
   */
  @Slash('bird', {
    description: `Image of a bird?`
  })
  async init(interaction: CommandInteraction): Promise<void> {
    const bird = await this.animalService.getBird();

    if (!bird?.link) {
      await interaction.reply('**No bird was given!**');
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return interaction.deleteReply();
    }

    const msg = this.createMessage(bird.link, interaction.client.user);
    return interaction.reply({ embeds: [msg] });
  }
}
