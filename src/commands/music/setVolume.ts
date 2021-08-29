import { Command, CommandMessage, Description } from '@typeit/discord';
import { MusicService } from 'Services/music.service';
import Utility from 'Utils/utility';

export class Play {
  private musicService: MusicService;

  constructor() {
    this.musicService = new MusicService();
  }

  /**
   * Init
   * @param command
   */
  @Command('Set volume')
  @Description('Set player volume')
  async init(command: CommandMessage): Promise<boolean | void> {
    if (command.deletable) await command.delete();

    let query = Utility.getOptionFromCommand(command.content, 2);
    query = typeof query === 'string' ? query : query.join(' ');

    return this.musicService.setVolume(command, +query);
  }
}
