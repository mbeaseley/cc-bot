import { Command, CommandMessage, Description } from '@typeit/discord';
import { Logger } from 'Services/logger.service';
import { YoutubeService } from 'Services/youtube.service';
import Translate from 'Utils/translate';
import Utility from 'Utils/utility';
import { Message } from 'discord.js';

export class Youtube {
  private logger: Logger;
  private youtubeService = new YoutubeService();

  constructor() {
    this.logger = new Logger();
    this.youtubeService = new YoutubeService();
  }

  @Command('add youtube')
  @Description('Add youtube channel to watch list')
  async init(command: CommandMessage): Promise<Message | void> {
    try {
      if (command.deletable) await command.delete();

      const msg = await Utility.sendMessage(
        command,
        Translate.find('youtubeFetch')
      );

      const id = Utility.getOptionFromCommand(
        command.content,
        2,
        ' '
      ) as string;

      if (!id) {
        return Utility.sendMessage(
          command,
          Translate.find('youtubeNoId'),
          'channel',
          5000
        );
      }

      await msg.delete();
      await this.youtubeService
        .addChannelToWatch(id)
        .then(() => {
          return Utility.sendMessage(
            command,
            Translate.find('youtubeSuccess'),
            'channel',
            5000
          );
        })
        .catch(() => {
          return Utility.sendMessage(
            command,
            Translate.find('youtubeError'),
            'channel',
            5000
          );
        });
    } catch (e: unknown) {
      if (command.deletable) await command.delete();
      this.logger.error(
        Translate.find('errorLog', 'add youtube', (e as Error).message)
      );
      return Utility.sendMessage(
        command,
        Translate.find('errorDefault', (e as Error).message),
        'channel',
        5000
      );
    }
  }
}
