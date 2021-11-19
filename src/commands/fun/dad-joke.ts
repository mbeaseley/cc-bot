import { ClientUser, CommandInteraction, MessageEmbed } from 'discord.js';
import { Discord, Slash, SlashOption } from 'discordx';
import { DadJokeService } from '../../services/dad-joke.service';

@Discord()
export abstract class DadJoke {
  private dadJokeService: DadJokeService;

  constructor() {
    this.dadJokeService = new DadJokeService();
  }

  /**
   * Create Message for dad joke command
   * @param advice
   * @returns MessageEmbed
   */
  private createMessage(joke: string, user: ClientUser | null): MessageEmbed {
    return new MessageEmbed()
      .setAuthor('Dad Joke Command', user?.displayAvatarURL())
      .setColor('RANDOM')
      .setDescription(joke);
  }

  /**
   * Dad joke Command
   * @param user
   * @param interaction
   */
  @Slash('joke', {
    description: `Make your friends laugh with a dad joke\nCommand: /joke user(optional)`,
  })
  async init(
    @SlashOption('user', {
      description: 'Who do you want to send a joke to?',
    })
    user: string,
    interaction: CommandInteraction
  ): Promise<void> {
    const { joke, delivery } = await this.dadJokeService.getJoke();
    console.log(joke);
    if (!joke) {
      await interaction.reply('**No dad joke was given!**');
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return interaction.deleteReply();
    }

    const jokeString = user
      ? `${user}, ${joke}\n${delivery ?? ''}`
      : `${joke}\n${delivery ?? ''}`;
    const msg = this.createMessage(jokeString, interaction.client.user);
    return interaction.reply({ embeds: [msg] });
  }
}
