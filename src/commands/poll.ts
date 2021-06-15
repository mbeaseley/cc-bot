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
   * Create Poll Object
   * @name createPollingObject
   * @param command
   */
  async createPollingObject(command: CommandMessage): Promise<Message | void> {
    const commandString = command.content.split('poll ').pop();
    const pollArray = commandString
      ?.split(/[\[\]']+/g)
      .filter((e) => e.trim() != '');

    if (!pollArray?.length) {
      this.logger.error(
        `${chalk.bold('BOT ERROR')}: incorrect formatting used on command`
      );
      return Promise.reject();
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

  @Command('poll')
  @Description('Create a poll for users to answer (max 26 options)')
  init(command: CommandMessage): Promise<Message | void> {
    return this.createPollingObject(command).catch(() => {
      command.reply(environment.error);
    });
  }
}
