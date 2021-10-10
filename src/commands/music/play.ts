import { Command, CommandMessage, Description } from '@typeit/discord';
import { Logger } from 'Services/logger.service';
import { MusicService } from 'Services/music.service';
import Translate from 'Utils/translate';
import Utility from 'Utils/utility';
import { Playlist, Song } from 'discord-music-player';
import { Message } from 'discord.js';

export class Play {
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
  @Command('play')
  @Description('Play your tracks and playlists')
  async init(
    command: CommandMessage
  ): Promise<Song | Playlist | Message | void> {
    try {
      if (command.deletable) await command.delete();

      let query = Utility.getOptionFromCommand(command.content, 2);
      query = typeof query === 'string' ? query : query.join(' ');

      if (!query) {
        return Utility.sendMessage(
          command,
          Translate.find('playAdd'),
          'channel',
          5000
        );
      }

      return query.indexOf('playlist') > -1
        ? this.musicService.addPlaylist(command, query)
        : this.musicService.play(command, query as string);
    } catch (e: unknown) {
      if (command.deletable) await command.delete();
      this.logger.error(
        Translate.find('errorLog', 'play', (e as Error).message)
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
