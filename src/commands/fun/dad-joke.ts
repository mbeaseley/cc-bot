import { Command, CommandMessage, Description } from '@typeit/discord';
import { DadJokeService } from 'Services/dad-joke.service';
import { Logger } from 'Services/logger.service';
import Utility from 'Utils/utility';
import { Message } from 'discord.js';

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

      const msg = command.channel.send('**:hourglass: Fetching Joke...**');

      const res = await this.dadJokeService.getJoke();
      await (await msg).delete();

      if (!res?.joke) {
        return command.channel
          .send('**No joke was found!**')
          .then((m) => m.delete({ timeout: 5000 }));
      }

      const message = this.createMessage(command, res.joke);

      return message.startsWith('<')
        ? command.channel.send(message)
        : command.reply(message);
    } catch (e: unknown) {
      if (command.deletable) await command.delete();
      this.logger.error(`Command: 'joke' has error: ${(e as Error).message}.`);
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
