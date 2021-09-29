import { Command, CommandMessage, Description } from '@typeit/discord';
import { ComplimentService } from 'Services/compliment.service';
import { Logger } from 'Services/logger.service';
import Translate from 'Utils/translate';
import Utility from 'Utils/utility';
import { Message } from 'discord.js';

export class Compliment {
  private complimentService: ComplimentService;
  private logger: Logger;

  constructor() {
    this.complimentService = new ComplimentService();
    this.logger = new Logger();
  }

  /**
   * Create message
   * @param command
   * @param message
   */
  private createMessage = (
    command: CommandMessage,
    message: string
  ): string => {
    const commandArray = Utility.getOptionFromCommand(command.content, 2);
    const string = commandArray?.[commandArray.length - 1];

    return string?.startsWith('<') && string?.endsWith('>')
      ? string.concat(', ', message)
      : message;
  };

  /**
   * @name complimentInit
   * @param command
   * @description Display compliment to author or tagged user
   * @returns
   */
  @Command('compliment')
  @Description('Send a nice compliment to yourself or a friend')
  async init(command: CommandMessage): Promise<Message | void> {
    try {
      if (command.deletable) await command.delete();

      const msg = await Utility.sendMessage(
        command,
        Translate.find('complimentFetch')
      );

      const res = await this.complimentService.getCompliment();
      await msg.delete();

      if (!res?.compliment) {
        return Utility.sendMessage(
          command,
          Translate.find('noCompliment'),
          'channel',
          5000
        );
      }

      const message = this.createMessage(command, res.compliment);

      return message.startsWith('<')
        ? Utility.sendMessage(command, message)
        : Utility.sendMessage(command, message, 'reply');
    } catch (e: unknown) {
      if (command.deletable) await command.delete();
      this.logger.error(
        Translate.find('errorLog', 'compliment', (e as Error).message)
      );
      return Utility.sendMessage(
        command,
        Translate.find('errorDefault', 'compliment', (e as Error).message),
        'channel',
        5000
      );
    }
  }
}
