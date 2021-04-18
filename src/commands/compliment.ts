import { Command, CommandMessage, Description } from '@typeit/discord';
import { AxiosResponse } from 'axios';
import { HttpClient } from '../interceptor/httpClient';
import { ComplimentObject } from '../types/compliment';
import { environment } from '../utils/environment';

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

  private createMessage = (command: CommandMessage, insult: string): string => {
    const commandArray = command.content.split(' ');
    const string = commandArray[commandArray.length - 1];

    return string.startsWith('<') && string.endsWith('>')
      ? string.concat(', ', insult)
      : insult;
  };

  /**
   * Init
   */
  public async getResponse(command: CommandMessage): Promise<void> {
    const complimentObj = await this.getRandomCompliment();

    if (!complimentObj?.compliment) {
      return Promise.reject();
    }

    const message = this.createMessage(command, complimentObj.compliment);

    message.startsWith('<')
      ? command.channel.send(message)
      : command.reply(message);

    return Promise.resolve();
  }

  /**
   * @name complimentInit
   * @param command
   * @description Display compliment to author or tagged user
   * @returns
   */
  @Command('compliment')
  @Description('Compliment')
  init(command: CommandMessage): Promise<void> {
    return this.getResponse(command).catch(() => {
      command.reply(environment.error);
    });
  }
}
