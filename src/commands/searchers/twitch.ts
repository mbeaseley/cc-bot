import { Command, CommandMessage, Description } from '@typeit/discord';
import { Message, MessageEmbed } from 'discord.js';
import { Logger } from '../../services/logger.service';
import { TwitchService } from '../../services/twitch.service';

export class Twitch {
  private logger: Logger;
  private twitchService: TwitchService;

  constructor() {
    this.logger = new Logger();
    this.twitchService = new TwitchService();
  }

  @Command('twitch')
  @Description('Find your favourites streamers')
  async init(command: CommandMessage): Promise<void | Message> {
    const commandArray = command.content.split(' ');
    commandArray.splice(0, 2);
    const username = commandArray.join(' ');

    try {
      const user = await this.twitchService.getUser(username);
      if (user?.id) {
        const stream = await this.twitchService.getStreams(username);
        const followers = await this.twitchService.getFollowersById(user.id);
        const message = new MessageEmbed()
          .setTitle(user.displayName)
          .setColor(6570405)
          .setURL(`https://twitch.tv/${user.loginName}`)
          .setThumbnail(`${user.profileImageUrl}`)
          .setAuthor('Twitch', 'https://i.imgur.com/4b9X738.png')
          .addField(
            `Biography: `,
            user.description || `This user doesn't have a biography.`,
            true
          )
          .addField(`Total Views: `, user.viewCount || `N/A`, true)
          .addField(`Followers: `, followers.total, true);

        if (stream?.id) {
          message
            .addField(
              '\u200B',
              `**${stream.title}** for ${stream.viewerCount} viewers`
            )
            .setImage(
              `${stream.thumbnailUrl
                ?.replace('{width}', `${1920}`)
                .replace('{height}', `${1080}`)}`
            );
        }
        await command.delete();
        return command.channel.send(message);
      } else {
        await command.delete();
        return command.channel.send('**Twitch user not found.**');
      }
    } catch (e: any) {
      command.delete();
      this.logger.error(`Command: 'twitch' has error: ${e.message}.`);
      return command.channel
        .send(
          `The following error has occurred: ${e.message}. If this error keeps occurring, please contact support.`
        )
        .then((m) => m.delete({ timeout: 5000 }));
    }
  }
}
