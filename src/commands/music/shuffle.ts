import { Command, CommandMessage, Description } from '@typeit/discord';
import { Logger } from 'Services/logger.service';
import { MusicService } from 'Services/music.service';
import Translate from 'Utils/translate';
import Utility from 'Utils/utility';
import { Message } from 'discord.js';

export class Shuffle {
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
  @Command('shuffle')
  @Description('Shuffle Queue')
  async init(command: CommandMessage): Promise<Message | void> {
    try {
      if (command.deletable) await command.delete();

      return this.musicService.shuffle(command);
    } catch (e: unknown) {
      if (command.deletable) await command.delete();
      this.logger.error(
        Translate.find('errorLog', 'shuffle', (e as Error).message)
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
