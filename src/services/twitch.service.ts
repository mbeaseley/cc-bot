import { logger } from './logger.service';
import { twitchModelService } from 'Models/twitch-model.service';
import { Followers, Stream, Streamers, User } from 'Types/twitch';
import { Command } from 'Utils/command';
import { environment } from 'Utils/environment';
import chalk = require('chalk');
import dayjs = require('dayjs');
import { Client, ClientUser, Guild, MessageEmbed, TextChannel } from 'discord.js';

export class TwitchService extends Command {
  private interval: number = 300 * 1000; // 5 minutes

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
  private createMessage(stream: Stream, iconURL: string): MessageEmbed {
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
  public async check(client: Client, guild: Guild): Promise<void> {
    setInterval(async () => {
      logger.info(chalk.bold('Checking channels'));
      const channels = await this.getDBStoredChannels(guild);

      channels.forEach(async (c) => {
        const stream = await this.getStreams(c.userLoginName);

        if (!stream?.startedAt) {
          return Promise.resolve();
        }

        const limitPastMS = dayjs().subtract(this.interval, 'milliseconds').valueOf();
        const streamMS = stream.startedAt.valueOf();

        if (streamMS + this.interval < limitPastMS) {
          return Promise.resolve();
        }

        const member = await guild.members.fetch(c.id);

        const textChannel = client.channels.cache.find(
          (c) => c.id === environment.streamsBase && c.isText()
        ) as TextChannel;

        const msg = this.c('twitchNotifyLive', stream.username ?? '~', stream.userLoginName ?? '~');
        const embedMsg = this.createMessage(stream, (member.user as ClientUser).displayAvatarURL());
        await textChannel.send(msg);
        return textChannel.send({ embeds: [embedMsg] });
      });
    }, this.interval);
  }
}

export const twitchService = new TwitchService();
