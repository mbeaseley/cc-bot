import { Command, CommandMessage, Description } from '@typeit/discord';
import { AxiosResponse } from 'axios';
import { HttpClient } from '../../interceptor/httpClient';
import { environment } from '../../utils/environment';

export class Insult extends HttpClient {
  constructor() {
    super('https://insult.mattbas.org/api/insult');
  }

  /**
   * Get random joke
   */
  getRandomInsult = (): Promise<AxiosResponse<string>> =>
    this.instance.get<string>('', {
      headers: {
        Accept: 'application/json',
      },
    });

  createMessage = (command: CommandMessage, insult: string): string => {
    const commandArray = command.content.split(' ');
    const string = commandArray[commandArray.length - 1];

    return string.startsWith('<') && string.endsWith('>')
      ? string.concat(', ', insult)
      : insult;
  };

  /**
   * Init
   */
  private async getResponse(command: CommandMessage): Promise<void> {
    const insult = await this.getRandomInsult();

    if (!insult) {
      return Promise.reject();
    }

    const message = this.createMessage(command, insult);

    command.delete();
    message.startsWith('<')
      ? command.channel.send(message)
      : command.reply(message);

    return Promise.resolve();
  }

  /**
   * @name insultInit
   * @param command
   * @description Display insult to author or tagged user
   * @returns
   */
  @Command('insult')
  @Description('Insult')
  init(command: CommandMessage): Promise<void> {
    return this.getResponse(command).catch(() => {
      command.reply(environment.error);
    });
  }
}
