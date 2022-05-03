import { animalsService } from 'Services/animal.service';
import { Command } from 'Utils/command';
import { ClientUser, CommandInteraction, MessageEmbed } from 'discord.js';
import { Discord, Slash, SlashGroup } from 'discordx';

@Discord()
@SlashGroup({ name: 'image', description: 'Images of animals' })
@SlashGroup('image')
export abstract class Bird extends Command {
  constructor() {
    super();
  }

  /**
   * Create Message for bird command
   * @param bird
   * @param user
   * @returns MessageEmbed
   */
  private createMessage(bird: string, user: ClientUser | null): MessageEmbed {
    return new MessageEmbed()
      .setAuthor({ name: this.c('birdCommand'), iconURL: user?.displayAvatarURL() })
      .setColor('RANDOM')
      .setImage(bird);
  }

  /**
   * Bird Command
   * @param user
   * @param interaction
   */
  @Slash('bird', {
    description: `image of a bird?`
  })
  async init(interaction: CommandInteraction): Promise<void> {
    const bird = await animalsService.getBird();

    if (!bird?.link) {
      await interaction.reply(this.c('birdNotFound'));
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return interaction.deleteReply();
    }

    const msg = this.createMessage(bird.link, interaction.client.user);
    return interaction.reply({ embeds: [msg] });
  }
}
