import { CommandInteraction, MessageEmbed } from 'discord.js';
import { Discord, Slash, SlashOption } from 'discordx';
import { InsultService } from '../../services/insult.service';

@Discord()
export abstract class Insult {
  private insultService: InsultService;

  constructor() {
    this.insultService = new InsultService();
  }

  /**
   * Create Message for insult command
   * @param advice
   * @returns MessageEmbed
   */
  private createMessage(insult: string): MessageEmbed {
    return new MessageEmbed()
      .setTitle('Insult Command')
      .setColor('RANDOM')
      .setDescription(insult);
  }

  /**
   * Insult Command
   * @param user
   * @param interaction
   */
  @Slash('insult', { description: `Send a fun insult to yourself or a friend` })
  async init(
    @SlashOption('user', {
      description: 'Who do you want to send advice to?',
    })
    user: string,
    interaction: CommandInteraction
  ): Promise<void> {
    const insult = await this.insultService.getInsult();

    if (!insult) {
      await interaction.reply('**No insult was given!**');
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return interaction.deleteReply();
    }

    const insultString = user ? `${user}, ${insult}` : insult;
    const msg = this.createMessage(insultString);
    return interaction.reply({ embeds: [msg] });
  }
}
