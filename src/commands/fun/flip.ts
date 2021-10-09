import { Command, CommandMessage, Description } from '@typeit/discord';
import { Logger } from 'Services/logger.service';
import Translate from 'Utils/translate';
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
    return Translate.find(coinFlip === 0 ? 'tails' : 'heads');
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
        Translate.find('flipFetch')
      );
      await msg.delete({ timeout: 1000 });

      const result = this.flipCoin();
      return setTimeout(() => {
        return Utility.sendMessage(command, Translate.find('flip', result));
      }, 1000);
    } catch (e: unknown) {
      if (command.deletable) await command.delete();
      this.logger.error(
        Translate.find('errorLog', 'flip', (e as Error).message)
      );
      return Utility.sendMessage(
        command,
        Translate.find('errorDefault', (e as Error).message),
        'channel',
        5000
      );
    }
  }
}
