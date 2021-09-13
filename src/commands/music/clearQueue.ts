import { Command, CommandMessage, Description } from '@typeit/discord';
import { MusicService } from 'Services/music.service';
import { Message } from 'discord.js';

export class ClearQueue {
  private musicService: MusicService;

  constructor() {
    this.musicService = new MusicService();
  }

  /**
   * Init
   * @param command
   */
  @Command('clear')
  @Description(`Clear queue (Won't clear current playing song)`)
  async init(command: CommandMessage): Promise<Message | void> {
    if (command.deletable) await command.delete();

    return this.musicService.clearQueue(command);
  }
}
