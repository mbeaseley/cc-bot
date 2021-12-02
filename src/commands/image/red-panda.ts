import { AnimalsService } from 'Services/animal.service';
import { ClientUser, CommandInteraction, MessageEmbed } from 'discord.js';
import { Discord, Slash } from 'discordx';

@Discord()
export abstract class RedPanda {
  private animalService: AnimalsService;

  constructor() {
    this.animalService = new AnimalsService();
  }

  /**
   * Create Message for red panda command
   * @param panda
   * @param user
   * @returns MessageEmbed
   */
  private createMessage(panda: string, user: ClientUser | null): MessageEmbed {
    return new MessageEmbed()
      .setAuthor('Red Panda Command', user?.displayAvatarURL())
      .setColor('RANDOM')
      .setImage(panda);
  }

  /**
   * Red Panda Command
   * @param user
   * @param interaction
   */
  @Slash('red-panda', {
    description: `Image of a red panda?`
  })
  async init(interaction: CommandInteraction): Promise<void> {
    const { link } = await this.animalService.getRedPanda();

    if (!link) {
      await interaction.reply('**No red panda was given!**');
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return interaction.deleteReply();
    }

    const msg = this.createMessage(link, interaction.client.user);
    return interaction.reply({ embeds: [msg] });
  }
}
