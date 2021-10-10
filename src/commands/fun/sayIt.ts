import { Command, CommandMessage, Description } from '@typeit/discord';
import { Compliment } from 'Commands/fun/compliment';
import { Insult } from 'Commands/fun/insults';
import { Logger } from 'Services/logger.service';
import Translate from 'Utils/translate';
import { Message } from 'discord.js';

export class SayIt {
  insult: Insult;
  compliment: Compliment;
  logger: Logger;

  constructor() {
    this.insult = new Insult();
    this.compliment = new Compliment();
    this.logger = new Logger();
  }

  /**
   * @name sayItInit
   * @param command
   * @description Display either compliment or insult to author or tagged user
   */
  @Command('sayIt')
  @Description('Flip a coin for a insult or compliment')
  async init(command: CommandMessage): Promise<Message | void> {
    try {
      const index = Math.round(Math.random());
      return index ? this.compliment.init(command) : this.insult.init(command);
    } catch (e: unknown) {
      if (command.deletable) await command.delete();
      return this.logger.error(
        Translate.find('errorLog', 'sayit', (e as Error).message)
      );
    }
  }
}
