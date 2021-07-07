import { Command, CommandMessage, Description } from '@typeit/discord';
import { Message, MessageEmbed } from 'discord.js';
import { Logger } from '../../services/logger.service';
import { AdviceService } from '../../services/advice.service';
import Utility from '../../utils/utility';

export class Advice {
  private logger: Logger;
  private adviceService: AdviceService;

  constructor() {
    this.logger = new Logger();
    this.adviceService = new AdviceService();
  }

  @Command('advice')
  @Description('Get some friendly advice')
  async init(command: CommandMessage): Promise<Message> {
    try {
      await command.delete();

      const user = Utility.getOptionFromCommand(command.content, 2)?.[0];
      const givenAdvice = await this.adviceService.getAdvice();

      if (!givenAdvice?.advice) {
        return command.channel
          .send('**No advice was given!**')
          .then((m) => m.delete({ timeout: 5000 }));
      }

      if (user) {
        return command.channel.send(`${user}, ${givenAdvice.advice}`);
      } else {
        return command.reply(givenAdvice.advice);
      }
    } catch (e: unknown) {
      await command.delete();
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
