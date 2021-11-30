import { ClientUser, CommandInteraction, MessageEmbed } from 'discord.js';
import { Discord, Slash, SlashOption } from 'discordx';
import { InsultService } from 'Services/insult.service';
import { ComplimentService } from 'Services/compliment.service';

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
  private createMessage(copy: string, user: ClientUser | null): MessageEmbed {
    return new MessageEmbed()
      .setAuthor('Say It Command', user?.displayAvatarURL())
      .setColor('RANDOM')
      .setDescription(copy);
  }

  /**
   * Say It Command
   * @param user
   * @param interaction
   */
  @Slash('say-it', {
    description: `Try your luck, get or send a user with a insult or compliment!`,
  })
  async init(
    @SlashOption('user', {
      description: 'Who do you want to send this to?',
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
    const msg = this.createMessage(copyString, interaction.client.user);
    return interaction.reply({ embeds: [msg] });
  }
}
