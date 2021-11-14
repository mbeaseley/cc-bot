import { DadJokeModelService } from '../models/dad-joke-model.service';
import { Joke } from '../types/dad-joke';

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
