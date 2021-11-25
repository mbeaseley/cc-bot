import {
  ClientUser,
  CommandInteraction,
  EmbedField,
  Message,
  MessageEmbed,
} from 'discord.js';
import { Discord, Slash, SlashOption } from 'discordx';
import { PollQuestion, selectionEmojis } from '../../types/poll';

@Discord()
export abstract class Poll {
  private alphabet: string[] = [...'abcdefghijklmnopqrstuvwxyz'];

  /**
   * Create embed messaged
   * @param poll
   * @param user
   * @returns MessageEmbed
   */
  private createMessage(
    poll: PollQuestion,
    user: ClientUser | null
  ): MessageEmbed {
    const answers = poll.answers
      .filter((el) => el)
      .map((a, i) => {
        return `${selectionEmojis[i][this.alphabet[i]]} ${a}\n`;
      });

    const field = {
      name: `${poll.question}\n  `,
      value: answers.toString().split(',').join(''),
      inline: false,
    } as EmbedField;

    return new MessageEmbed()
      .setAuthor('Poll Command', user?.displayAvatarURL())
      .setColor(19100)
      .addField(field.name, field.value, field.inline);
  }

  @Slash('poll', {
    description: 'Create a poll for friends to answer (max 26 options)',
  })
  async init(
    @SlashOption('question', {
      description: 'What is your poll question?',
      required: true,
    })
    question: string,
    @SlashOption('options', {
      description:
        'What are your poll options? (Split each option using a comma)',
      required: true,
    })
    options: string,
    interaction: CommandInteraction
  ): Promise<void> {
    const poll = new PollQuestion(question, options.split(',') ?? []);

    const msg = this.createMessage(poll, interaction.client.user);
    const message = (await interaction.reply({
      embeds: [msg],
      fetchReply: true,
    })) as Message;
    return poll.answers.forEach(async (_, i) => {
      await message.react(selectionEmojis[i][this.alphabet[i]]);
    });
  }
}
