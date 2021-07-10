import { Command, CommandMessage, Description } from '@typeit/discord';
import { HttpClient } from 'Interceptor/httpClient';
import { JokeResponse } from 'Types/dadJoke';
import { environment } from 'Utils/environment';
import { Message } from 'discord.js';

export class DadJoke extends HttpClient {
  constructor() {
    super('https://icanhazdadjoke.com/');
  }

  /**
   * Get random joke
   */
  private getRandomJoke = () =>
    this.instance.get<JokeResponse>('', {
      headers: {
        Accept: 'application/json',
      },
    });

  /**
   * Init
   */
  private async getReponse(command: CommandMessage): Promise<Message> {
    const res = await this.getRandomJoke();

    if (!res?.joke) {
      return Promise.reject();
    }

    if (command.deletable) await command.delete();
    return command.reply(res.joke);
  }

  /**
   * @name jokeInit
   * @param command
   * @description Display joke
   * @returns
   */
  @Command('joke')
  @Description('Make your friends laugh with a dad joke')
  async jokeInit(command: CommandMessage): Promise<Message> {
    return this.getReponse(command).catch(() => {
      return command.reply(environment.error);
    });
  }
}
