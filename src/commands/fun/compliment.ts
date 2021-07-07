import { Command, CommandMessage, Description } from '@typeit/discord';
import { AxiosResponse } from 'axios';
import { Message } from 'discord.js';
import { HttpClient } from '../../interceptor/httpClient';
import { ComplimentObject } from '../../types/compliment';
import { environment } from '../../utils/environment';
import Utility from '../../utils/utility';

export class Compliment extends HttpClient {
  constructor() {
    super('https://complimentr.com/api');
  }

  /**
   * Get random joke
   */
  private getRandomCompliment = (): Promise<AxiosResponse<ComplimentObject>> =>
    this.instance.get<ComplimentObject>('', {
      headers: {
        Accept: 'application/json',
      },
    });

  /**
   * Create message
   * @param command
   * @param message
   */
  private createMessage = (
    command: CommandMessage,
    message: string
  ): string => {
    const commandArray = Utility.getOptionFromCommand(command.content, 2);
    const string = commandArray?.[commandArray.length - 1];

    return string?.startsWith('<') && string?.endsWith('>')
      ? string.concat(', ', message)
      : message;
  };

  /**
   * Init
   */
  private async getResponse(command: CommandMessage): Promise<Message> {
    const complimentObj = await this.getRandomCompliment();

    if (!complimentObj?.compliment) {
      return Promise.reject();
    }

    const message = this.createMessage(command, complimentObj.compliment);

    if (command.deletable) await command.delete();
    return message.startsWith('<')
      ? command.channel.send(message)
      : command.reply(message);
  }

  /**
   * @name complimentInit
   * @param command
   * @description Display compliment to author or tagged user
   * @returns
   */
  @Command('compliment')
  @Description('Send a nice compliment to yourself or a friend')
  async init(command: CommandMessage): Promise<Message> {
    return this.getResponse(command).catch(() => {
      return command.reply(environment.error);
    });
  }
}
