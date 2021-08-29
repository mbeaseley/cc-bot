import { Command, CommandMessage, Description } from '@typeit/discord';
import { MusicService } from 'Services/music.service';

export class Play {
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
  async init(command: CommandMessage): Promise<boolean | void> {
    if (command.deletable) await command.delete();

    return this.musicService.stop(command);
  }
}
