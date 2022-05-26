import { logger } from './logger.service';
import { twitchModelService } from 'Models/twitch-model.service';
import { Followers, Stream, Streamers, User } from 'Types/twitch';
import { Command } from 'Utils/command';
import { environment } from 'Utils/environment';
import chalk = require('chalk');
import dayjs = require('dayjs');
import { ClientUser, Guild, MessageEmbed, TextChannel } from 'discord.js';

class TwitchService extends Command {
  private interval: number = 1000 * 60 * 0.5; // 5 minutes

  /**
   * Get User
   * @returns Promise<User>
   */
  public async getUser(name: string): Promise<User> {
    return twitchModelService.getUser(name);
  }

  /**
   * Get Streams
   * @returns Promise<Stream>
   */
  public async getStreams(username: string): Promise<Stream> {
    return twitchModelService.getStreams(username);
  }

  /**
   * Get Followers by id
   * @returns Promise<Followers>
   */
  public async getFollowersById(id: string): Promise<Followers> {
    return twitchModelService.getFollowersById(id);
  }

  /**
   * Fetch watchlist streamers
   * @param guild
   * @returns Promise<Streamers[]>
   */
  private async getDBStoredChannels(guild: Guild): Promise<Streamers[]> {
    return twitchModelService.getDBStoredChannels(guild);
  }

  /**
   * Create message for check
   * @param stream
   * @param iconURL
   * @returns MessageEmbed
   */
  private createMessage(stream: Stream, iconURL?: string): MessageEmbed {
    return new MessageEmbed()
      .setAuthor({ name: this.c(`twitchFreeText`, stream.username ?? '~'), iconURL })
      .setTitle(this.c(`twitchFreeText`, stream.title ?? '~'))
      .setURL(this.c('twitchUrl', stream.userLoginName ?? '~'))
      .setColor(6570405)
      .setImage(`${stream.thumbnailUrl}`);
  }

  /**
   * Check if streamers are live
   */
  public async check(guild: Guild): Promise<void> {
    setInterval(async () => {
      logger.info(chalk.bold('Checking channels'));

      const streamersChannels = await this.getDBStoredChannels(guild);

      console.log(streamersChannels);

      streamersChannels.forEach(async (c) => {
        const stream = await this.getStreams(c.userLoginName);

        if (!stream?.startedAt) {
          return Promise.resolve();
        }

        const channels = await guild.channels.fetch();

        const textChannel = channels.find(
          (c) => c.id === environment.streamsBase && c.isText()
        ) as TextChannel;

        if (!textChannel) {
          return Promise.resolve();
        }

        const messages = await textChannel.messages.fetch({ limit: 100 });
        const streamerMessages = messages.filter(
          (m) => !!m.embeds.find((e) => e.url?.includes(stream?.userLoginName ?? 'n/a'))
        );

        const hourInPast = dayjs(streamerMessages.first()?.createdAt).subtract(1, 'hour').unix();

        const messagesInTime = streamerMessages.filter(
          (m) =>
            !!(
              stream?.startedAt &&
              m.createdTimestamp > stream.startedAt.valueOf() &&
              m.createdTimestamp > hourInPast
            )
        ).size;

        if (messagesInTime) {
          logger.info(
            chalk.bold(
              `${
                stream.username
              } already sent! ${messagesInTime} since stream started at ${stream.startedAt.format(
                'YYYY-MM-DD HH:mm:ssZ[Z]'
              )}`
            )
          );
          return Promise.resolve();
        }

        logger.info(chalk.bold(`${stream.username} notification sending!`));

        const member = await guild.members.fetch(c.id);

        const msg = this.c('twitchNotifyLive', stream.username ?? '~', stream.userLoginName ?? '~');
        const embedMsg = this.createMessage(
          stream,
          (member.user as ClientUser)?.displayAvatarURL()
        );
        await textChannel.send(msg);
        return textChannel.send({ embeds: [embedMsg] });
      });
    }, this.interval);
  }
}

export const twitchService = new TwitchService();
