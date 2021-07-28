import { Command, CommandMessage, Description } from '@typeit/discord';
import { InstagramService } from 'Services/instagram.service';
import { Logger } from 'Services/logger.service';
import { InstaUser } from 'Types/instagram';
import Utility from 'Utils/utility';
import { Message, MessageEmbed } from 'discord.js';

export class Instagram {
  private logger: Logger;
  private instagramService: InstagramService;

  constructor() {
    this.logger = new Logger();
    this.instagramService = new InstagramService();
  }

  /**
   * Create Embed Message
   * @param u
   */
  private createMessage(u: InstaUser): MessageEmbed {
    return new MessageEmbed()
      .setColor(0x0099ff)
      .setTitle(u.fullName)
      .setURL(`https://instagram.com/${u.username}`)
      .setThumbnail(u.profileImage ?? '')
      .addField(`Username:`, u.username || '~')
      .addField(`Full Name: `, u.fullName || '~')
      .addField(`Biography: `, u.biography || '~')
      .addField(`Posts:`, u.posts || '~', true)
      .addField(`Followers: `, u.followers || '~', true)
      .addField(`Following: `, u.following || '~', true)
      .addField(`Private Account: `, u.private ? 'Yes 🔐' : 'No 🔓', true)
      .addField(`Verified Account: `, u.verified ? 'Yes ✅' : 'No ❌', true);
  }

  /**
   *  Fetch and create insta message
   * @param command
   * @returns
   */
  @Command('instagram')
  @Description('Find someone you know on Instagram')
  async init(command: CommandMessage): Promise<void | Message> {
    try {
      if (command.deletable) await command.delete();

      const msg = await command.channel.send(
        '**:hourglass: Fetching account...**'
      );

      const username = Utility.getOptionFromCommand(
        command.content,
        2,
        ' '
      ) as string;

      const instaUser = await this.instagramService.getInstaUser(username);
      await msg.delete();

      if (!instaUser?.username) {
        return Utility.sendMessage(
          command,
          '**This username was unable to be found.**',
          'channel',
          5000
        );
      }

      const message = this.createMessage(instaUser);
      return Utility.sendMessage(command, message);
    } catch (e: unknown) {
      if (command.deletable) await command.delete();
      this.logger.error(
        `Command: 'instagram' has error: ${(e as Error).message}.`
      );
      return Utility.sendMessage(
        command,
        `The following error has occurred: ${
          (e as Error).message
        }. If this error keeps occurring, please contact support.`,
        'channel',
        5000
      );
    }
  }
}
