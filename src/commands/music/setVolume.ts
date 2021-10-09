import { Command, CommandMessage, Description } from '@typeit/discord';
import { Logger } from 'Services/logger.service';
import { MusicService } from 'Services/music.service';
import Translate from 'Utils/translate';
import Utility from 'Utils/utility';
import { Song } from 'discord-music-player';
import { Message } from 'discord.js';

export class setVolume {
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
  @Command('set volume')
  @Description('Set player volume')
  async init(command: CommandMessage): Promise<Song | Message> {
    try {
      if (command.deletable) await command.delete();

      let query = Utility.getOptionFromCommand(command.content, 2);
      query = typeof query === 'string' ? query : query.join(' ');

      return this.musicService.setVolume(command, +query);
    } catch (e: unknown) {
      if (command.deletable) await command.delete();
      this.logger.error(
        Translate.find('errorLog', 'set volume', (e as Error).message)
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
