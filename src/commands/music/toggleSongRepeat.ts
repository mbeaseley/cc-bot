import { Command, CommandMessage, Description } from '@typeit/discord';
import { MusicService } from 'Services/music.service';
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

    return this.musicService.toggleQueueLoop(command);
  }
}
