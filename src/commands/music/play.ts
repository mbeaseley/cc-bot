import { Command, CommandMessage, Description } from '@typeit/discord';
import { MusicService } from 'Services/music.service';
import Utility from 'Utils/utility';
import { Playlist, Song } from 'discord-music-player';

export class Play {
  private musicService: MusicService;

  constructor() {
    this.musicService = new MusicService();
  }

  /**
   * Init
   * @param command
   */
  @Command('play')
  @Description('Play your tracks and playlists')
  async init(command: CommandMessage): Promise<Song | Playlist | void> {
    if (command.deletable) await command.delete();

    let query = Utility.getOptionFromCommand(command.content, 2);
    query = typeof query === 'string' ? query : query.join(' ');

    return query.indexOf('playlist') > -1
      ? this.musicService.addPlaylist(command, query)
      : this.musicService.play(command, query as string);
  }
}
