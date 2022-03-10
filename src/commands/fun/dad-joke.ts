import { DadJokeService } from 'Services/dad-joke.service';
import { Command } from 'Utils/command';
import { ClientUser, CommandInteraction, MessageEmbed } from 'discord.js';
import { Discord, Slash, SlashOption } from 'discordx';

@Discord()
export abstract class DadJoke extends Command {
  private dadJokeService: DadJokeService;

  constructor() {
    super();
    this.dadJokeService = new DadJokeService();
  }

  /**
   * Create Message for dad joke command
   * @param joke
   * @param user
   * @returns MessageEmbed
   */
  private createMessage(joke: string, user: ClientUser | null): MessageEmbed {
    return new MessageEmbed()
      .setAuthor({ name: this.c('jokeTitle'), iconURL: user?.displayAvatarURL() })
      .setColor('RANDOM')
      .setDescription(joke);
  }

  /**
   * Dad joke Command
   * @param user
   * @param interaction
   */
  @Slash('joke', {
    description: `Make your friends laugh with a dad joke.`
  })
  async init(
    @SlashOption('user', {
      description: 'Who do you want to send a joke to?',
      required: false
    })
    user: string,
    interaction: CommandInteraction
  ): Promise<void> {
    const { joke, delivery } = await this.dadJokeService.getJoke();

    if (!joke) {
      await interaction.reply(this.c('noJoke'));
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return interaction.deleteReply();
    }

    const jokeString = user ? `${user}, ${joke}\n${delivery ?? ''}` : `${joke}\n${delivery ?? ''}`;
    const msg = this.createMessage(jokeString, interaction.client.user);
    return interaction.reply({ embeds: [msg] });
  }
}
