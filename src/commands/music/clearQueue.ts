import { Command, CommandMessage, Description } from '@typeit/discord';
import { Logger } from 'Services/logger.service';
import { MusicService } from 'Services/music.service';
import Translate from 'Utils/translate';
import Utility from 'Utils/utility';
import { Message } from 'discord.js';

export class ClearQueue {
  private musicService: MusicService;
  private logger: Logger;

  constructor() {
    this.musicService = new MusicService();
    this.logger = new Logger();
  }

  /**
   * Init
   * @param command
   */
  @Command('clear')
  @Description(`Clear queue (Won't clear current playing song)`)
  async init(command: CommandMessage): Promise<Message | void> {
    try {
      if (command.deletable) await command.delete();

      return this.musicService.clearQueue(command);
    } catch (e: unknown) {
      if (command.deletable) await command.delete();
      this.logger.error(
        Translate.find('errorLog', 'clear', (e as Error).message)
      );
      return Utility.sendMessage(
        command,
        Translate.find('errorDefault', (e as Error).message),
        'channel',
        5000
      );
    }
  }
}
