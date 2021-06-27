import { Command, CommandMessage, Description } from '@typeit/discord';
import { HttpClient } from '../../interceptor/httpClient';
import { JokeResponse } from '../../types/dadJoke';
import { environment } from '../../utils/environment';

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
  public async getReponse(command: CommandMessage): Promise<void> {
    const res = await this.getRandomJoke();

    if (!res?.joke) {
      return Promise.reject();
    }

    command.delete();
    command.reply(res.joke);
    return Promise.resolve();
  }

  /**
   * @name jokeInit
   * @param command
   * @description Display joke
   * @returns
   */
  @Command('joke')
  @Description('Make your friends laugh with a dad joke')
  jokeInit(command: CommandMessage): Promise<void> {
    return this.getReponse(command).catch(() => {
      command.reply(environment.error);
    });
  }
}
