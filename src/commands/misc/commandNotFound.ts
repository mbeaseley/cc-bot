import { CommandMessage, CommandNotFound } from '@typeit/discord';
import { Message } from 'discord.js';
import { environment } from 'Utils/environment';

export class NotFoundCommand {
  /**
   * @name commandNotFound
   * @param command
   * @description When an unrecognized is used
   * @returns
   */
  @CommandNotFound()
  async commandNotFound(command: CommandMessage): Promise<Message | void> {
    if (command.content.indexOf(environment.botId) > -1) {
      if (command.deletable) await command.delete();
      return command.reply(environment.commandNotFound);
    }

    return Promise.resolve();
  }
}
