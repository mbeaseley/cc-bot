import { Command, CommandMessage, Description } from '@typeit/discord';
import { Logger } from '../services/logger.service';
import * as chalk from 'chalk';
import { environment } from '../utils/environment';
import { PollQuestion, selectionEmojis } from '../types/poll';
import { ClientUser, EmbedField, Message, MessageEmbed } from 'discord.js';

export class Poll {
  private logger: Logger;
  private baseEmoji: string = 'regional_indicator_';
  private alphabet: string[] = [...'abcdefghijklmnopqrstuvwxyz'];
  constructor() {
    this.logger = new Logger();
  }

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
        return `${selectionEmojis[`${this.alphabet[i]}`]} ${a}\n`;
      });

    const field = {
      name: `${poll.question}\n  `,
      value: answers.toString().split(',').join(''),
      inline: false,
    } as EmbedField;

    return new MessageEmbed()
      .setAuthor(`${user?.username} Poll`, user?.displayAvatarURL())
      .setColor(19100)
      .addField(field.name, field.value, field.inline);
  }

  /**
   * Create Poll
   * @name init
   * @param command
   */
  @Command('poll')
  @Description('Create a poll for users to answer (max 26 options)')
  async init(command: CommandMessage): Promise<Message | void> {
    const commandString = command.content.split('poll ').pop();
    const pollArray = commandString
      ?.split(' ')
      .map((a) => a.replace(/[^a-zA-Z0-9? ]/g, ''));

    if (!pollArray?.length) {
      return Promise.resolve();
    }

    if (command.deletable) {
      command.delete();
    }

    const poll = new PollQuestion(pollArray[0], pollArray.slice(1));
    const embed = this.createMessage(poll, command.client.user);
    return command.channel.send(embed).then(async (message) => {
      poll.answers.forEach((a, i) => {
        message.react(selectionEmojis[`${this.alphabet[i]}`]);
      });
    });
  }
}
