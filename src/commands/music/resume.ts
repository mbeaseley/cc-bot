import { Command, CommandMessage, Description } from '@typeit/discord';
import { MusicService } from 'Services/music.service';
import { Message } from 'discord.js';

export class Resume {
  private musicService: MusicService;

  constructor() {
    this.musicService = new MusicService();
  }

  /**
   * Init
   * @param command
   */
  @Command('resume')
  @Description('Resume current quene')
  async init(command: CommandMessage): Promise<Message | void> {
    if (command.deletable) await command.delete();

    return this.musicService.resume(command);
  }
}
