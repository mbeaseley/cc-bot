import { Command, CommandMessage, Description } from '@typeit/discord';
import { Logger } from 'Services/logger.service';
import Utility from 'Utils/utility';
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

      const msg = await Utility.sendMessage(
        command,
        '**:hourglass: Flipping coin!**'
      );
      await msg.delete({ timeout: 1000 });

      const result = this.flipCoin();
      return setTimeout(() => {
        return Utility.sendMessage(command, `**${result} :coin:**`);
      }, 1000);
    } catch (e: unknown) {
      if (command.deletable) await command.delete();
      this.logger.error(
        `Command: 'advice' has error: ${(e as Error).message}.`
      );
      return Utility.sendMessage(
        command,
        `The following error has occurred: ${
          (e as Error).message
        }. If this error keeps occurring, please contact support.`,
        'channel',
        5000
      );
    }
  }
}
