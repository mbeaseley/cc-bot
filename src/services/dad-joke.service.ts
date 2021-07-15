import { DadJokeModelService } from 'Models/dad-joke-model.service';
import { JokeResponse } from 'Types/dadJoke';

export class DadJokeService {
  private dadJokeModelService: DadJokeModelService;

  constructor() {
    this.dadJokeModelService = new DadJokeModelService();
  }

  /**
   * Fetch Joke
   * @returns Promise<JokeResponse>
   */
  public async getJoke(): Promise<JokeResponse> {
    return this.dadJokeModelService.getJoke();
  }
}
