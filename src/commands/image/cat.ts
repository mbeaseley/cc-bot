import { AnimalsService } from 'Services/animal.service';
import { ClientUser, CommandInteraction, MessageEmbed } from 'discord.js';
import { Discord, Slash } from 'discordx';

@Discord()
export abstract class Cat {
  private animalService: AnimalsService;

  constructor() {
    this.animalService = new AnimalsService();
  }

  /**
   * Create Message for cats command
   * @param cat
   * @param user
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
    description: `Image of a cat?`
  })
  async init(interaction: CommandInteraction): Promise<void> {
    const cat = await this.animalService.getCat();

    if (!cat?.link) {
      await interaction.reply('**No cat was given!**');
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return interaction.deleteReply();
    }

    const msg = this.createMessage(cat?.link, interaction.client.user);
    return interaction.reply({ embeds: [msg] });
  }
}
