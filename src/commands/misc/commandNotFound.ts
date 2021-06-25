import { CommandMessage, CommandNotFound } from '@typeit/discord';
import { Message } from 'discord.js';
import { environment } from '../../utils/environment';

export class NotFoundCommand {
  /**
   * @name commandNotFound
   * @param command
   * @description When an unrecognized is used
   * @returns
   */
  @CommandNotFound()
  commandNotFound(command: CommandMessage): Promise<Message | void> {
    if (command.content.indexOf(environment.botId) > -1) {
      command.delete();
      return command.reply(environment.commandNotFound);
    }

    return Promise.resolve();
  }
}
