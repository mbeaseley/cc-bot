import { Command, CommandMessage, Description, Guard } from '@typeit/discord';
import { isAdmin } from 'Guards/isAdmin';
import { environment } from 'Utils/environment';
import { TextChannel } from 'discord.js';

export class Purge {
  private getPurgeCount(command: string): number {
    const commandArray = command.split(' ');
    let purgeCount: string | number = commandArray[commandArray.length - 1];
    return (purgeCount = isNaN(+purgeCount) ? 1 : +purgeCount);
  }

  /**
   * Init
   * @param command
   */
  private async purge(command: CommandMessage): Promise<void> {
    const purgeCount = this.getPurgeCount(command.content);

    try {
      await command.delete();
      const fetched = await command.channel.messages.fetch({
        limit: purgeCount,
      });
      await (command.channel as TextChannel)
        .bulkDelete(fetched, true)
        .catch(() => Promise.reject());

      return Promise.resolve();
    } catch (e: unknown) {
      return Promise.reject(e);
    }
  }

  /**
   * @name purgeInit
   * @param command
   * @description Delete messages in bulk (Admins only)
   * @returns
   */
  @Command('purge')
  @Description('Purge a maximum of 100 messages')
  @Guard(isAdmin)
  purgeInit(command: CommandMessage): Promise<void> {
    return this.purge(command).catch(() => {
      command.reply(environment.error);
    });
  }
}
