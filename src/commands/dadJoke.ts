import { CommandMessage } from '@typeit/discord';
import { HttpClient } from '../interceptor/httpClient';

export interface JokeResponse {
  id: string;
  joke: string;
  status: number;
}

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
  public async init(command: CommandMessage): Promise<void> {
    const res = await this.getRandomJoke();

    if (!res?.joke) {
      return Promise.reject();
    }

    command.reply(res.joke);
    return Promise.resolve();
  }
}