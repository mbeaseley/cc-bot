import { Command, CommandMessage, Description } from '@typeit/discord';
import { InsultsService } from 'Services/insults.service';
import { Logger } from 'Services/logger.service';
import Translate from 'Utils/translate';
import Utility from 'Utils/utility';
import { Message } from 'discord.js';

export class Insult {
  private insultsService: InsultsService;
  private logger: Logger;

  constructor() {
    this.insultsService = new InsultsService();
    this.logger = new Logger();
  }

  /**
   * Create message
   * @param command
   * @param insult
   */
  private createMessage = (command: CommandMessage, insult: string): string => {
    const commandArray = Utility.getOptionFromCommand(command.content, 2);
    const string = commandArray?.[commandArray.length - 1];

    return string?.startsWith('<') && string?.endsWith('>')
      ? string.concat(', ', insult)
      : insult;
  };

  /**
   * @name insultInit
   * @param command
   * @description Display insult to author or tagged user
   * @returns
   */
  @Command('insult')
  @Description('Send a fun insult to yourself or a friend')
  async init(command: CommandMessage): Promise<Message> {
    try {
      if (command.deletable) await command.delete();

      const msg = await Utility.sendMessage(
        command,
        Translate.find('insultFetch')
      );

      const res = await this.insultsService.getInsult();
      await msg.delete();

      if (!res) {
        return Utility.sendMessage(
          command,
          Translate.find('noInsult'),
          'channel',
          5000
        );
      }

      const message = this.createMessage(command, res);
      return message.startsWith('<')
        ? command.channel.send(message)
        : command.reply(message);
    } catch (e: unknown) {
      if (command.deletable) await command.delete();
      this.logger.error(
        Translate.find('errorLog', 'insult', (e as Error).message)
      );
      return Utility.sendMessage(
        command,
        Translate.find('errorDefault', 'insult', (e as Error).message),
        'channel',
        5000
      );
    }
  }
}
