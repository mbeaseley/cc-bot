import { dadJokeModelService } from 'Models/dad-joke-model.service';
import { Joke } from 'Types/dad-joke';

class DadJokeService {
  /**
   * Fetch Joke
   * @returns Promise<Joke>
   */
  public async getJoke(): Promise<Joke> {
    return dadJokeModelService.getJoke();
  }
}

export const dadJokeService = new DadJokeService();
