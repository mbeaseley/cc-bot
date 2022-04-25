import { animalsService } from 'Services/animal.service';
import { Command } from 'Utils/command';
import { ClientUser, CommandInteraction, MessageEmbed } from 'discord.js';
import { Discord, Slash, SlashGroup } from 'discordx';

@Discord()
@SlashGroup({ name: 'image', description: 'Images of animals' })
@SlashGroup('image')
export abstract class Koala extends Command {
  constructor() {
    super();
  }

  /**
   * Create Message for koala command
   * @param koala
   * @param user
   * @returns MessageEmbed
   */
  private createMessage(koala: string, user: ClientUser | null): MessageEmbed {
    return new MessageEmbed()
      .setAuthor({ name: this.c('koalaCommand'), iconURL: user?.displayAvatarURL() })
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
    const koala = await animalsService.getKoala();

    if (!koala?.link) {
      await interaction.reply(this.c('koalaNotFound'));
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return interaction.deleteReply();
    }

    const msg = this.createMessage(koala.link, interaction.client.user);
    return interaction.reply({ embeds: [msg] });
  }
}
