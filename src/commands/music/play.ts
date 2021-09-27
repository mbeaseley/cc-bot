import { Command, CommandMessage, Description } from '@typeit/discord';
import { MusicService } from 'Services/music.service';
import Utility from 'Utils/utility';
import { Playlist, Song } from 'discord-music-player';
import { Message } from 'discord.js';

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
  async init(
    command: CommandMessage
  ): Promise<Song | Playlist | Message | void> {
    if (command.deletable) await command.delete();

    let query = Utility.getOptionFromCommand(command.content, 2);
    query = typeof query === 'string' ? query : query.join(' ');

    if (!query) {
      return Utility.sendMessage(
        command,
        '**Please add a song or playlist link when using this command!**',
        'channel',
        5000
      );
    }

    return query.indexOf('playlist') > -1
      ? this.musicService.addPlaylist(command, query)
      : this.musicService.play(command, query as string);
  }
}
