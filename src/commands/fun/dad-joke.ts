import { Command, CommandMessage, Description } from '@typeit/discord';
import { DadJokeService } from 'Services/dad-joke.service';
import { Logger } from 'Services/logger.service';
import Utility from 'Utils/utility';
import { Message } from 'discord.js';
import Translate from 'Root/utils/translate';

export class DadJoke {
  private dadJokeService: DadJokeService;
  private logger: Logger;

  constructor() {
    this.dadJokeService = new DadJokeService();
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
   * @name jokeInit
   * @param command
   * @description Display joke
   * @returns
   */
  @Command('joke')
  @Description('Make your friends laugh with a dad joke')
  async init(command: CommandMessage): Promise<Message> {
    try {
      if (command.deletable) await command.delete();

      const msg = await Utility.sendMessage(
        command,
        Translate.find('jokeFetch')
      );

      const res = await this.dadJokeService.getJoke();
      await msg.delete();

      if (!res?.joke) {
        return Utility.sendMessage(
          command,
          Translate.find('noJoke'),
          'channel',
          5000
        );
      }

      const message = this.createMessage(command, res.joke);

      return message.startsWith('<')
        ? Utility.sendMessage(command, message)
        : Utility.sendMessage(command, message, 'reply');
    } catch (e: unknown) {
      if (command.deletable) await command.delete();
      this.logger.error(
        Translate.find('errorLog', 'joke', (e as Error).message)
      );
      return Utility.sendMessage(
        command,
        Translate.find('errorDefault', 'joke', (e as Error).message),
        'channel',
        5000
      );
    }
  }
}
