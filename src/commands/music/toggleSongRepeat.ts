import { Command, CommandMessage, Description } from '@typeit/discord';
import { MusicService } from 'Services/music.service';
import Utility from 'Utils/utility';
import { Message } from 'discord.js';

export class ToggleSongRepeat {
  private musicService: MusicService;

  constructor() {
    this.musicService = new MusicService();
  }

  /**
   * Init
   * @param command
   */
  @Command('repeat')
  @Description('Toggle repeat of current song')
  async init(command: CommandMessage): Promise<Message | void> {
    if (command.deletable) await command.delete();

    let value = !!Utility.getOptionFromCommand(command.content, 2);

    return this.musicService.setRepeatMode(command, value);
  }
}
