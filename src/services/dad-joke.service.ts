import { DadJokeModelService } from 'Models/dad-joke-model.service';
import { Joke } from 'Types/dad-joke';

export class DadJokeService {
  private dadJokeModelService: DadJokeModelService;

  constructor() {
    this.dadJokeModelService = new DadJokeModelService();
  }

  /**
   * Fetch Joke
   * @returns Promise<Joke>
   */
  public async getJoke(): Promise<Joke> {
    return this.dadJokeModelService.getJoke();
  }
}

export const dadJokeService = new DadJokeService();
