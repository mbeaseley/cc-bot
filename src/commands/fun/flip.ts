import { Command, CommandMessage, Description } from '@typeit/discord';
import { Logger } from 'Services/logger.service';
import { Message } from 'discord.js';

export class coinFlip {
  private logger: Logger;

  constructor() {
    this.logger = new Logger();
  }

  /**
   * Coin flip event
   * @returns
   */
  flipCoin(): string {
    const coinFlip = Math.floor(Math.random() * 2);
    return coinFlip === 0 ? 'Tails' : 'Heads';
  }

  /**
   * Coin flip command
   * @param command
   */
  @Command('flip')
  @Description('Flip a coin')
  async init(command: CommandMessage): Promise<NodeJS.Timeout | Message> {
    try {
      if (command.deletable) await command.delete();

      const msg = command.channel.send(`**:hourglass: Flipping coin!**`);
      (await msg).delete({ timeout: 1000 });

      const result = this.flipCoin();
      return setTimeout(() => {
        return command.channel.send(`**${result} :coin:**`);
      }, 1000);
    } catch (e: unknown) {
      if (command.deletable) await command.delete();
      this.logger.error(
        `Command: 'advice' has error: ${(e as Error).message}.`
      );
      return command.channel
        .send(
          `The following error has occurred: ${
            (e as Error).message
          }. If this error keeps occurring, please contact support.`
        )
        .then((m) => m.delete({ timeout: 5000 }));
    }
  }
}
