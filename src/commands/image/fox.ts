import { ClientUser, CommandInteraction, MessageEmbed } from 'discord.js';
import { Discord, Slash } from 'discordx';
import { AnimalsService } from 'Services/animal.service';

@Discord()
export abstract class Fox {
  private animalService: AnimalsService;

  constructor() {
    this.animalService = new AnimalsService();
  }

  /**
   * Create Message for fox command
   * @param fox
   * @param user
   * @returns MessageEmbed
   */
  private createMessage(fox: string, user: ClientUser | null): MessageEmbed {
    return new MessageEmbed()
      .setAuthor('Fox Command', user?.displayAvatarURL())
      .setColor('RANDOM')
      .setImage(fox);
  }

  /**
   * Fox Command
   * @param user
   * @param interaction
   */
  @Slash('fox', {
    description: `Image of a fox?`
  })
  async init(interaction: CommandInteraction): Promise<void> {
    const { link } = await this.animalService.getFox();

    if (!link) {
      await interaction.reply('**No fox was given!**');
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return interaction.deleteReply();
    }

    const msg = this.createMessage(link, interaction.client.user);
    return interaction.reply({ embeds: [msg] });
  }
}
