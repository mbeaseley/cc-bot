import { CommandMessage, CommandNotFound } from '@typeit/discord';
import { environment } from 'Utils/environment';
import Translate from 'Utils/translate';
import Utility from 'Utils/utility';
import { Message } from 'discord.js';

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
      return Utility.sendMessage(
        command,
        Translate.find('error'),
        'reply',
        5000
      );
    }

    return Promise.resolve();
  }
}
