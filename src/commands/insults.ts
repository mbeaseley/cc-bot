import { CommandMessage } from '@typeit/discord';
import { AxiosResponse } from 'axios';
import { HttpClient } from '../interceptor/httpClient';

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
    const commandArray = command?.content?.split(' ');
    const string = commandArray[commandArray.length - 1];

    return string.startsWith('<') && string.endsWith('>')
      ? string.concat(', ', insult)
      : insult;
  };

  /**
   * Init
   */
  public async init(command: CommandMessage): Promise<void> {
    const insult = await this.getRandomInsult();

    if (!insult) {
      return Promise.reject();
    }

    const message = this.createMessage(command, insult);

    message.startsWith('<')
      ? command.channel.send(message)
      : command.reply(message);

    return Promise.resolve();
  }
}
