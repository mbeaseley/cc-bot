import { Command, CommandMessage, Description } from '@typeit/discord';
import { MusicService } from 'Services/music.service';
import { Song } from 'discord-music-player';

export class Stop {
  private musicService: MusicService;

  constructor() {
    this.musicService = new MusicService();
  }

  /**
   * Init
   * @param command
   */
  @Command('stop')
  @Description('Stop and clear quene')
  async init(command: CommandMessage): Promise<Song | void> {
    if (command.deletable) await command.delete();

    return this.musicService.stop(command);
  }
}
