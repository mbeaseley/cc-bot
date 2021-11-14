import { CommandInteraction, MessageEmbed } from 'discord.js';
import { Discord, Slash, SlashOption } from 'discordx';
import { InsultService } from '../../services/insult.service';
import { ComplimentService } from '../../services/compliment.service';

@Discord()
export abstract class SayIt {
  private insultService: InsultService;
  private complimentService: ComplimentService;

  constructor() {
    this.insultService = new InsultService();
    this.complimentService = new ComplimentService();
  }

  /**
   * Create Message for say it command
   * @param advice
   * @returns MessageEmbed
   */
  private createMessage(copy: string): MessageEmbed {
    return new MessageEmbed()
      .setTitle('Say It Command')
      .setColor('RANDOM')
      .setDescription(copy);
  }

  /**
   * Say It Command
   * @param user
   * @param interaction
   */
  @Slash('sayit', {
    description: `Try your luck, get or send a user with a insult or compliment!`,
  })
  async init(
    @SlashOption('user', {
      description: 'Who do you want to send advice to?',
    })
    user: string,
    interaction: CommandInteraction
  ): Promise<void> {
    const index = Math.round(Math.random());

    const copy = index
      ? await this.complimentService.getCompliment().then((c) => {
          return c.compliment;
        })
      : await this.insultService.getInsult().then((i) => i);

    if (!copy) {
      await interaction.reply('**No insult or compliment was given!**');
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return interaction.deleteReply();
    }

    const copyString = user ? `${user}, ${copy}` : copy;
    const msg = this.createMessage(copyString);
    return interaction.reply({ embeds: [msg] });
  }
}
