import { AnimalsService } from 'Services/animal.service';
import { Command } from 'Utils/command';
import { ClientUser, CommandInteraction, MessageEmbed } from 'discord.js';
import { Discord, Slash } from 'discordx';

@Discord()
export abstract class Cat extends Command {
  private animalService: AnimalsService;

  constructor() {
    super();
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
      .setAuthor({ name: this.c('catAuthor'), iconURL: user?.displayAvatarURL() })
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
      await interaction.reply(this.c('catNotFound'));
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return interaction.deleteReply();
    }

    const msg = this.createMessage(cat?.link, interaction.client.user);
    return interaction.reply({ embeds: [msg] });
  }
}
