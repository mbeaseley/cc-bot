import { CommandMessage } from '@typeit/discord';
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
  public async init(command: CommandMessage): Promise<void> {
    const purgeCount = this.getPurgeCount(command.content);

    try {
      command.delete();
      const fetched = await command.channel.messages.fetch({
        limit: purgeCount,
      });
      const textChannel = command.channel as TextChannel;
      textChannel.bulkDelete(fetched, true);
      return Promise.resolve();
    } catch (e) {
      return Promise.reject();
    }
  }
}
