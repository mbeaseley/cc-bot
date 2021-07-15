import { Command, CommandMessage, Description } from '@typeit/discord';
import { ComplimentService } from 'Services/compliment.service';
import { Logger } from 'Services/logger.service';
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

      const msg = command.channel.send(
        '**:hourglass: Fetching Compliment...**'
      );

      const res = await this.complimentService.getCompliment();
      await (await msg).delete();
      if (!res?.compliment) {
        return command.channel
          .send('**No compliment was found!**')
          .then((m) => m.delete({ timeout: 5000 }));
      }

      const message = this.createMessage(command, res.compliment);

      return message.startsWith('<')
        ? command.channel.send(message)
        : command.reply(message);
    } catch (e: unknown) {
      if (command.deletable) await command.delete();
      this.logger.error(
        `Command: 'compliment' has error: ${(e as Error).message}.`
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
