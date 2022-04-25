import { AnimalsService } from 'Services/animal.service';
import { Command } from 'Utils/command';
import { ClientUser, CommandInteraction, MessageEmbed } from 'discord.js';
import { Discord, Slash, SlashGroup } from 'discordx';

@Discord()
@SlashGroup({ name: 'image', description: 'Images of animals' })
@SlashGroup('image')
export abstract class Panda extends Command {
  private animalService: AnimalsService;

  constructor() {
    super();
    this.animalService = new AnimalsService();
  }

  /**
   * Create Message for panda command
   * @param panda
   * @param user
   * @returns MessageEmbed
   */
  private createMessage(panda: string, user: ClientUser | null): MessageEmbed {
    return new MessageEmbed()
      .setAuthor({ name: this.c('pandaCommand'), iconURL: user?.displayAvatarURL() })
      .setColor('RANDOM')
      .setImage(panda);
  }

  /**
   * Panda Command
   * @param user
   * @param interaction
   */
  @Slash('panda', {
    description: `Image of a panda?`
  })
  async init(interaction: CommandInteraction): Promise<void> {
    const panda = await this.animalService.getPanda();

    if (!panda?.link) {
      await interaction.reply(this.c('pandaNotFound'));
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return interaction.deleteReply();
    }

    const msg = this.createMessage(panda.link, interaction.client.user);
    return interaction.reply({ embeds: [msg] });
  }
}
