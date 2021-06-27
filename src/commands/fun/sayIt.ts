import { Command, CommandMessage, Description } from '@typeit/discord';
import { environment } from '../../utils/environment';
import { Compliment } from './compliment';
import { Insult } from './insults';

export class SayIt {
  insult: Insult;
  compliment: Compliment;

  constructor() {
    this.insult = new Insult();
    this.compliment = new Compliment();
  }

  /**
   * Init
   * @param command
   */
  private getResponse(command: CommandMessage): Promise<void> {
    const index = Math.round(Math.random());

    const promise = index
      ? this.compliment.init(command)
      : this.insult.init(command);

    return promise;
  }

  /**
   * @name sayItInit
   * @param command
   * @description Display either compliment or insult to author or tagged user
   * @returns
   */
  @Command('sayIt')
  @Description('flip a coin for a insult or compliment')
  init(command: CommandMessage): Promise<void> {
    return this.getResponse(command).catch(() => {
      command.reply(environment.error);
    });
  }
}
