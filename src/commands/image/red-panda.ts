import { animalsService } from 'Services/animal.service';
import { Command } from 'Utils/command';
import { ClientUser, CommandInteraction, MessageEmbed } from 'discord.js';
import { Discord, Slash, SlashGroup } from 'discordx';

@Discord()
@SlashGroup({ name: 'image', description: 'Images of animals' })
@SlashGroup('image')
export abstract class RedPanda extends Command {
  constructor() {
    super();
  }

  /**
   * Create Message for red panda command
   * @param panda
   * @param user
   * @returns MessageEmbed
   */
  private createMessage(panda: string, user: ClientUser | null): MessageEmbed {
    return new MessageEmbed()
      .setAuthor({ name: this.c('redPandaCommand'), iconURL: user?.displayAvatarURL() })
      .setColor('RANDOM')
      .setImage(panda);
  }

  /**
   * Red Panda Command
   * @param user
   * @param interaction
   */
  @Slash('red-panda', {
    description: `image of a red panda?`
  })
  async init(interaction: CommandInteraction): Promise<void> {
    const panda = await animalsService.getRedPanda();

    if (!panda?.link) {
      await interaction.reply(this.c('redPandaNotFound'));
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return interaction.deleteReply();
    }

    const msg = this.createMessage(panda.link, interaction.client.user);
    return interaction.reply({ embeds: [msg] });
  }
}
