import { Command, CommandMessage, Description } from '@typeit/discord';
import { Logger } from 'Services/logger.service';
import { MusicService } from 'Services/music.service';
import Translate from 'Utils/translate';
import Utility from 'Utils/utility';
import { Message } from 'discord.js';

export class ToggleSongRepeat {
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
  @Command('repeat')
  @Description('Toggle repeat of current song')
  async init(command: CommandMessage): Promise<Message | void> {
    try {
      if (command.deletable) await command.delete();

      const value = !!Utility.getOptionFromCommand(command.content, 2);
      return this.musicService.setRepeatMode(command, value);
    } catch (e: unknown) {
      if (command.deletable) await command.delete();
      this.logger.error(
        Translate.find('errorLog', 'repeat', (e as Error).message)
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
