import { CommandMessage } from '@typeit/discord';
import { Compliment } from './compliment';
import { Insult } from './insults';

export class SayIt {
  private insult: Insult;
  private compliment: Compliment;

  constructor() {
    this.insult = new Insult();
    this.compliment = new Compliment();
  }

  /**
   * Init
   * @param command
   */
  public init(command: CommandMessage): Promise<void> {
    const index = Math.round(Math.random());

    const promise = index
      ? this.compliment.init(command)
      : this.insult.init(command);

    return promise;
  }
}
