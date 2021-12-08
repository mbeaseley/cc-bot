import { AnimalsService } from 'Services/animal.service';
import { ClientUser, CommandInteraction, MessageEmbed } from 'discord.js';
import { Discord, Slash } from 'discordx';

@Discord()
export abstract class Koala {
  private animalService: AnimalsService;

  constructor() {
    this.animalService = new AnimalsService();
  }

  /**
   * Create Message for koala command
   * @param koala
   * @param user
   * @returns MessageEmbed
   */
  private createMessage(koala: string, user: ClientUser | null): MessageEmbed {
    return new MessageEmbed()
      .setAuthor('Koala Command', user?.displayAvatarURL())
      .setColor('RANDOM')
      .setImage(koala);
  }

  /**
   * koala Command
   * @param user
   * @param interaction
   */
  @Slash('koala', {
    description: `Image of a koala?`
  })
  async init(interaction: CommandInteraction): Promise<void> {
    const koala = await this.animalService.getKoala();

    if (!koala?.link) {
      await interaction.reply('**No koala was given!**');
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return interaction.deleteReply();
    }

    const msg = this.createMessage(koala.link, interaction.client.user);
    return interaction.reply({ embeds: [msg] });
  }
}
