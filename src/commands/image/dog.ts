import { AnimalsService } from 'Services/animal.service';
import { Command } from 'Utils/command';
import { ClientUser, CommandInteraction, MessageEmbed } from 'discord.js';
import { Discord, Slash, SlashGroup } from 'discordx';

@Discord()
@SlashGroup({ name: 'image', description: 'Images of animals' })
@SlashGroup('image')
export abstract class Dog extends Command {
  private animalService: AnimalsService;

  constructor() {
    super();
    this.animalService = new AnimalsService();
  }

  /**
   * Create Message for dog command
   * @param dog
   * @param user
   * @returns MessageEmbed
   */
  private createMessage(dog: string, user: ClientUser | null): MessageEmbed {
    return new MessageEmbed()
      .setAuthor({ name: this.c('dogAuthor'), iconURL: user?.displayAvatarURL() })
      .setColor('RANDOM')
      .setImage(dog);
  }

  /**
   * Dog Command
   * @param user
   * @param interaction
   */
  @Slash('dog', {
    description: `Image of a dog?`
  })
  async init(interaction: CommandInteraction): Promise<void> {
    const dog = await this.animalService.getDog();

    if (!dog?.link) {
      await interaction.reply(this.c('dogNotFound'));
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return interaction.deleteReply();
    }

    const msg = this.createMessage(dog.link, interaction.client.user);
    return interaction.reply({ embeds: [msg] });
  }
}
