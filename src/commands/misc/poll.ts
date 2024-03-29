import { PollQuestion, selectionEmojis } from 'Types/poll';
import { Command } from 'Utils/command';
import { ClientUser, CommandInteraction, EmbedField, Message, MessageEmbed } from 'discord.js';
import { Discord, Slash, SlashOption } from 'discordx';

@Discord()
export abstract class Poll extends Command {
  private alphabet: string[] = [...'abcdefghijklmnopqrstuvwxyz'];

  constructor() {
    super();
  }

  /**
   * Create embed messaged
   * @param poll
   * @param user
   * @returns MessageEmbed
   */
  private createMessage(poll: PollQuestion, user: ClientUser | null): MessageEmbed {
    const answers = poll.answers
      .filter((el) => el)
      .map((a, i) => {
        return `${selectionEmojis[i][this.alphabet[i]]} ${a}\n`;
      });

    const field = {
      name: `${poll.question}\n  `,
      value: answers.toString().split(',').join(''),
      inline: false
    } as EmbedField;

    return new MessageEmbed()
      .setAuthor({ name: this.c('pollHeading'), iconURL: user?.displayAvatarURL() })
      .setColor(19100)
      .addField(field.name, field.value, field.inline);
  }

  @Slash('poll', {
    description: 'miscellaneous command to create a poll for friends to answer (max 26 options). '
  })
  async init(
    @SlashOption('question', {
      description: 'What is your poll question?'
    })
    question: string,
    @SlashOption('options', {
      description: 'What are your poll options? (Split each option using a comma)'
    })
    options: string,
    interaction: CommandInteraction
  ): Promise<void> {
    const poll = new PollQuestion(question, options.split(',') ?? []);

    const msg = this.createMessage(poll, interaction.client.user);
    const message = (await interaction.reply({
      embeds: [msg],
      fetchReply: true
    })) as Message;
    return poll.answers.forEach(async (_, i) => {
      await message.react(selectionEmojis[i][this.alphabet[i]]);
    });
  }
}
