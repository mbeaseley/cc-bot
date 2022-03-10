import { AnimalsService } from 'Services/animal.service';
import { Command } from 'Utils/command';
import { ClientUser, CommandInteraction, MessageEmbed } from 'discord.js';
import { Discord, Slash } from 'discordx';

@Discord()
export abstract class Fox extends Command {
  private animalService: AnimalsService;

  constructor() {
    super();
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
      .setAuthor({ name: this.c('foxCommand'), iconURL: user?.displayAvatarURL() })
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
    const fox = await this.animalService.getFox();

    if (!fox?.link) {
      await interaction.reply(this.c('foxNotFound'));
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return interaction.deleteReply();
    }

    const msg = this.createMessage(fox.link, interaction.client.user);
    return interaction.reply({ embeds: [msg] });
  }
}
