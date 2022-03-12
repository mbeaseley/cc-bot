import { InsultService } from 'Services/insult.service';
import { Command } from 'Utils/command';
import { ClientUser, CommandInteraction, MessageEmbed } from 'discord.js';
import { Discord, Slash, SlashOption } from 'discordx';

@Discord()
export abstract class Insult extends Command {
  private insultService: InsultService;

  constructor() {
    super();
    this.insultService = new InsultService();
  }

  /**
   * Create Message for insult command
   * @param insult
   * @param user
   * @returns MessageEmbed
   */
  private createMessage(insult: string, user: ClientUser | null): MessageEmbed {
    return new MessageEmbed()
      .setAuthor({ name: this.c('insultTitle'), iconURL: user?.displayAvatarURL() })
      .setColor('RANDOM')
      .setDescription(insult);
  }

  /**
   * Insult Command
   * @param user
   * @param interaction
   */
  @Slash('insult', {
    description: `Send a fun insult to yourself or a friend.`
  })
  async init(
    @SlashOption('user', {
      description: 'Who do you want to send a insult to?',
      required: false
    })
    user: string,
    interaction: CommandInteraction
  ): Promise<void> {
    const insult = await this.insultService.getInsult();

    if (!insult) {
      await interaction.reply(this.c('noInsult'));
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return interaction.deleteReply();
    }

    const insultString = user ? `${user}, ${insult}` : insult;
    const msg = this.createMessage(insultString, interaction.client.user);
    return interaction.reply({ embeds: [msg] });
  }
}
