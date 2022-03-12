import { AdviceService } from 'Services/advice.service';
import { Command } from 'Utils/command';
import { ClientUser, CommandInteraction, MessageEmbed } from 'discord.js';
import { Discord, Slash, SlashOption } from 'discordx';

@Discord()
export abstract class Advice extends Command {
  private adviceService: AdviceService;

  constructor() {
    super();
    this.adviceService = new AdviceService();
  }

  /**
   * Create Message for advice command
   * @param advice
   * @param user
   * @returns MessageEmbed
   */
  private createMessage(advice: string, user: ClientUser | null): MessageEmbed {
    return new MessageEmbed()
      .setAuthor({ name: this.c('adviceTitle'), iconURL: user?.displayAvatarURL() })
      .setColor('RANDOM')
      .setDescription(advice);
  }

  /**
   * Advice Command
   * @param user
   * @param interaction
   */
  @Slash('advice', {
    description: `Send some friendly advice to yourself or a friend.`
  })
  async init(
    @SlashOption('user', {
      description: 'Who do you want to send advice to?',
      required: false
    })
    user: string,
    interaction: CommandInteraction
  ): Promise<void> {
    const { advice } = await this.adviceService.getAdvice();

    if (!advice) {
      await interaction.reply(this.c('noAdvice'));
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return interaction.deleteReply();
    }

    const adviceString = user ? `${user}, ${advice}` : advice;
    const msg = this.createMessage(adviceString, interaction.client.user);
    return interaction.reply({ embeds: [msg] });
  }
}
