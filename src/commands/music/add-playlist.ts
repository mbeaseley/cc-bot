import { Command, CommandMessage, Description } from '@typeit/discord';
import { Playlist } from 'discord-music-player';
import { MusicService } from 'Services/music.service';
import Utility from 'Utils/utility';

export class AddPlaylist {
  private musicService: MusicService;

  constructor() {
    this.musicService = new MusicService();
  }

  @Command('playlist')
  @Description('Add playlist to queue')
  async init(command: CommandMessage): Promise<Playlist | void> {
    if (command.deletable) command.delete();

    let query = Utility.getOptionFromCommand(command.content, 2);
    query = typeof query === 'string' ? query : query.join(' ');

    return this.musicService.addPlaylist(command, query as string);
  }
}
