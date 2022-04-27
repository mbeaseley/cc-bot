import { databaseService } from 'Services/database.service';
import { logger } from 'Services/logger.service';
import { ServersCollection } from 'Types/database';
import { Channel, ChannelRssResponse, Video, YoutubeChannel } from 'Types/youtube';
import { Command } from 'Utils/command';
import { environment } from 'Utils/environment';
import chalk = require('chalk');
import dayjs = require('dayjs');
import { ClientUser, Message, MessageEmbed, TextChannel } from 'discord.js';
import { Client } from 'discordx';
import Parser from 'rss-parser';

export class YoutubeService extends Command {
  private interval: number = 300 * 1000; // 5 minutes

  constructor() {
    super();
  }

  /**
   * Get watchlist channels
   * @returns string[]
   */
  private async getDBStoredChannels(): Promise<YoutubeChannel[]> {
    return (await databaseService.get('servers', ServersCollection.youtube)) as YoutubeChannel[];
  }

  /**
   * Map channel content
   * @param res
   * @returns
   */
  private fromPayload(res: ChannelRssResponse): Channel {
    return new Channel(res.link, res.feedUrl, res.title, res.items);
  }

  /**
   * Create message
   * @param video
   * @param botIcon
   */
  private createMessage(video: Video, botIcon: string): MessageEmbed {
    return new MessageEmbed()
      .setAuthor({ name: this.c('youtubeAuthor', video.author), iconURL: botIcon })
      .setTitle(video.title)
      .setColor(16711680)
      .setDescription(this.c('youtubeDes', video.link))
      .setImage(`https://i.ytimg.com/vi/${video.id}/maxresdefault.jpg`)
      .setFooter(dayjs().format('DD/MM/YYYY'));
  }

  public async check(client: Client): Promise<Message | void> {
    setInterval(async () => {
      logger.info(chalk.bold('Checking channels'));
      const channels = await this.getDBStoredChannels();
      const parser = new Parser();
      channels.forEach(async (c) => {
        const res = (await parser.parseURL(
          `https://www.youtube.com/feeds/videos.xml?channel_id=${c.channelId}`
        )) as ChannelRssResponse;
        const channelResponse = this.fromPayload(res);

        const latestVideo = channelResponse.items?.[0];

        if (c.latestVideoId !== latestVideo.id) {
          await databaseService.update(
            'servers',
            ServersCollection.youtube,
            {
              channelId: c.channelId
            },
            {
              channelId: c.channelId,
              latestVideoId: channelResponse.items[0].id
            }
          );

          const textChannel = client.channels.cache.find(
            (c) => c.id === environment.streamsBase && c.isText()
          ) as TextChannel;
          const msg = this.createMessage(
            channelResponse.items[0],
            (client.user as ClientUser).displayAvatarURL()
          );
          return textChannel.send({ embeds: [msg] });
        }

        return Promise.resolve();
      });
    }, this.interval);
  }

  /**
   * Check and add channel id to watch list in database
   * @param channelId
   */
  public async addChannelToWatch(channelId: string): Promise<void> {
    const channels = await this.getDBStoredChannels();

    if (channels.find((c) => c.channelId === channelId)) {
      return Promise.reject();
    }

    return databaseService.create('servers', ServersCollection.youtube, {
      channelId
    });
  }
}

export const youtubeService = new YoutubeService();
