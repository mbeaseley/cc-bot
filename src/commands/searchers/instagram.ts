import { Command, CommandMessage, Description } from '@typeit/discord';
import { InstagramService } from 'Services/instagram.service';
import { Logger } from 'Services/logger.service';
import { InstaUser } from 'Types/instagram';
import Translate from 'Utils/translate';
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
      .setURL(Translate.find('instaUrl', u.username as string))
      .setThumbnail(u.profileImage ?? '')
      .addField(Translate.find('instaUsernameHeader'), u.username || '~')
      .addField(Translate.find('instaNameHeader'), u.fullName || '~')
      .addField(Translate.find('instaBioHeader'), u.biography || '~')
      .addField(Translate.find('instaPostHeader'), u.posts || '~', true)
      .addField(
        Translate.find('instaFollowersHeader'),
        u.followers || '~',
        true
      )
      .addField(
        Translate.find('instaFollowingHeader'),
        u.following || '~',
        true
      )
      .addField(
        Translate.find('instaPrivateHeader'),
        u.private ? 'Yes 🔐' : 'No 🔓',
        true
      )
      .addField(
        Translate.find('instaVerifiedHeader'),
        u.verified ? 'Yes ✅' : 'No ❌',
        true
      );
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

      const msg = await command.channel.send(Translate.find('instaFetch'));

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
          Translate.find('instaNoUser'),
          'channel',
          5000
        );
      }

      const message = this.createMessage(instaUser);
      return Utility.sendMessage(command, message);
    } catch (e: unknown) {
      if (command.deletable) await command.delete();
      this.logger.error(
        Translate.find('errorLog', 'instagram', (e as Error).message)
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
