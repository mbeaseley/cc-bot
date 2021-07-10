import { Command, CommandMessage, Description } from '@typeit/discord';
import { Compliment } from 'Commands/fun/compliment';
import { Insult } from 'Commands/fun/insults';
import { Message } from 'discord.js';
import { environment } from 'Utils/environment';

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
  private getResponse(command: CommandMessage): Promise<Message | void> {
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
   */
  @Command('sayIt')
  @Description('Flip a coin for a insult or compliment')
  async init(command: CommandMessage): Promise<Message | void> {
    return this.getResponse(command).catch(() => {
      command.reply(environment.error);
    });
  }
}
