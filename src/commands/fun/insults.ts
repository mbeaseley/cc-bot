import { Command, CommandMessage, Description } from '@typeit/discord';
import { AxiosResponse } from 'axios';
import { Message } from 'discord.js';
import { HttpClient } from 'Interceptor/httpClient';
import { environment } from 'Utils/environment';
import Utility from 'Utils/utility';

export class Insult extends HttpClient {
  constructor() {
    super('https://insult.mattbas.org/api/insult');
  }

  /**
   * Get random joke
   */
  private getRandomInsult = (): Promise<AxiosResponse<string>> =>
    this.instance.get<string>('', {
      headers: {
        Accept: 'application/json',
      },
    });

  /**
   * Create message
   * @param command
   * @param insult
   */
  private createMessage = (command: CommandMessage, insult: string): string => {
    const commandArray = Utility.getOptionFromCommand(command.content, 2);
    const string = commandArray?.[commandArray.length - 1];

    return string?.startsWith('<') && string?.endsWith('>')
      ? string.concat(', ', insult)
      : insult;
  };

  /**
   * Init
   */
  private async getResponse(command: CommandMessage): Promise<Message> {
    const insult = await this.getRandomInsult();

    if (!insult) {
      return Promise.reject();
    }

    const message = this.createMessage(command, insult);

    if (command.deletable) await command.delete();
    return message.startsWith('<')
      ? command.channel.send(message)
      : command.reply(message);
  }

  /**
   * @name insultInit
   * @param command
   * @description Display insult to author or tagged user
   * @returns
   */
  @Command('insult')
  @Description('Send a fun insult to yourself or a friend')
  init(command: CommandMessage): Promise<Message> {
    return this.getResponse(command).catch(() => {
      return command.reply(environment.error);
    });
  }
}
