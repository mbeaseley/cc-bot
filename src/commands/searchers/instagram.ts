import { Command, CommandMessage, Description } from '@typeit/discord';
import { Message, MessageEmbed } from 'discord.js';
import { InstaUser } from '../../types/instagram';
import { InstagramService } from '../../services/instagram.service';
import { Logger } from '../../services/logger.service';

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
      .addField(`Username:`, u.username)
      .addField(`Full Name: `, u.fullName)
      .addField(`Biography: `, u.biography)
      .addField(`Posts:`, u.posts, true)
      .addField(`Followers: `, u.followers, true)
      .addField(`Following: `, u.following, true)
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
    const commandArray = command.content.split(' ');
    commandArray.splice(0, 2);
    const username = commandArray.join(' ');

    try {
      const instaUser = await this.instagramService.getInstaUser(username);

      if (!instaUser?.username) {
        return command.channel
          .send('**This username was unable to be found.**')
          .then((m) => m.delete({ timeout: 10000 }));
      }

      const message = this.createMessage(instaUser);
      await command.delete();
      return command.channel.send(message);
    } catch (e) {
      this.logger.error(`Command: 'instagram' has error: ${e.message}.`);
      return command.channel
        .send(
          `The following error has occurred: ${e.message}. If this error keeps occurring, please contact support.`
        )
        .then((m) => m.delete({ timeout: 5000 }));
    }
  }
}
