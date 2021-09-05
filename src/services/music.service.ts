import { CommandMessage } from '@typeit/discord';
import { Main } from 'Root/main';
import { getVoiceState } from 'Types/music';
import Utility from 'Utils/utility';
import {
  GuildMember,
  MessageEmbed,
  TextChannel,
  VoiceChannel,
  VoiceState,
} from 'discord.js';
import { Player, Playlist, Song } from 'discord-music-player';
import { environment } from 'Root/utils/environment';

export class MusicService {
  constructor() {}

  /**
   * Music player init
   */
  public init(): void {
    const player = new Player(Main.Client, {
      leaveOnEmpty: true,
      volume: 70,
    });

    Main.Client['player'] = player;
    this.displayMessaging();
  }

  /*===================
   * Utility functions
   ===================*/

  /**
   * Checks if user is in voice channel
   * @param command
   */
  private async checkUserInChannel(command: CommandMessage): Promise<boolean> {
    if (!command.member?.voice.channel) {
      await Utility.sendMessage(
        command,
        '**You are not in a voice channel that I can join.**'
      );
      return false;
    }

    return true;
  }

  /**
   * Check if VC is full and bot can't join doesn't have (MANAGE_CHANNELS)
   * @param command
   */
  private async checkChannel(
    command: CommandMessage
  ): Promise<{ memberVoice: VoiceState; bot: GuildMember } | undefined> {
    const memberVoice = command.member?.voice;
    const bot = command.guild?.me;

    if (
      !memberVoice?.channel?.full &&
      bot &&
      !memberVoice?.channel?.permissionsFor(bot)?.has('MANAGE_CHANNELS')
    ) {
      await Utility.sendMessage(
        command,
        '**The voice channel is full**',
        'channel',
        10000
      );

      return undefined;
    }

    return {
      memberVoice: memberVoice as VoiceState,
      bot: bot as GuildMember,
    };
  }

  /**
   * Check if bot is active in voice channel
   * @param command
   */
  private isBotActive(command: CommandMessage): VoiceChannel | undefined {
    return command.guild?.me?.voice.channel ?? undefined;
  }

  /**
   * Get Channel to message
   */
  private getChannel(): TextChannel {
    return Main.Client.channels.cache.get(
      environment.commandBase
    ) as TextChannel;
  }

  /*===================
   * Commands
   ===================*/

  /**
   * Join voice channel
   * @param command
   * @returns
   */
  public async join(command: CommandMessage): Promise<boolean> {
    const userCheck = await this.checkUserInChannel(command);
    const res = await this.checkChannel(command);

    if (userCheck && res?.memberVoice) {
      await res.memberVoice.channel?.join();
      await res.bot?.voice.setSelfDeaf(true);
      return Promise.resolve(true);
    }

    return Promise.resolve(false);
  }

  /**
   * Disconnect bot from voice channel
   * @param command
   */
  public async disconnect(command: CommandMessage): Promise<void> {
    const botActive = this.isBotActive(command);
    return botActive?.leave() ?? Promise.resolve();
  }

  /**
   * Play track
   * @param command
   */
  public async play(
    command: CommandMessage,
    query: string
  ): Promise<Song | void> {
    const res = await this.join(command);
    return res
      ? ((await Main.Client['player'].play(command, query)) as Song)
      : Promise.resolve();
  }

  /**
   * Add playlist
   * @param command
   * @param query
   */
  public async addPlaylist(
    command: CommandMessage,
    query: string
  ): Promise<Playlist | void> {
    const res = await this.join(command);
    return res
      ? ((await Main.Client['player'].playlist(command, query)) as Playlist)
      : Promise.resolve();
  }

  /**
   * Stop and clear player quene
   * @param command
   */
  public async stop(command: CommandMessage): Promise<boolean | void> {
    const active = this.isBotActive(command);

    return active ? Main.Client['player'].stop(command) : Promise.resolve();
  }

  /**
   * Pause current music
   * @param command
   */
  public async pause(command: CommandMessage): Promise<Song | void> {
    const active = this.isBotActive(command);

    return active ? Main.Client['player'].pause(command) : Promise.resolve();
  }

  /**
   * Resume current music
   * @param command
   */
  public async resume(command: CommandMessage): Promise<Song | void> {
    const active = this.isBotActive(command);

    return active ? Main.Client['player'].resume(command) : Promise.resolve();
  }

  /**
   * Set volume
   * @param command
   */
  public async setVolume(
    command: CommandMessage,
    value: number
  ): Promise<boolean | void> {
    return Main.Client['player'].setVolume(command, value);
  }

  /*======================
   * Event based Messaging
   =======================*/

  /**
   * Create Voice Update Message
   * @param message
   */
  private createVoiceUpdateMessage(message: string): MessageEmbed {
    return new MessageEmbed().setColor(10027008).setDescription(message);
  }

  private createSongUpdateMessage(song: Song, now = false): MessageEmbed {
    const title = now ? '🎶 Now Playing' : '🎶 Song added to queue';
    let songImage = song.thumbnail.toString();
    if (song.thumbnail.toString().indexOf('i.ytimg.com') > -1) {
      songImage = songImage.replace(/^hq:\d+$/, 'hqdefault');
    }

    return new MessageEmbed()
      .setTitle(title)
      .setColor(10027008)
      .setDescription(`[**${song.name}**](${song.url})`)
      .setImage(songImage)
      .setTimestamp();
  }

  private createPLaylistAddedMessage(playlist: any): MessageEmbed {
    const plist = playlist as Playlist;

    let plistDescription = plist.videos
      .map((v: Song, i: number) => {
        if (i < 10) {
          return `\`${i + 1}\` [${v.name}](${v.url})\n`;
        }
        return '';
      })
      .join('');

    if (plist.videos.length > 9) {
      plistDescription += `\`\n\n${
        plist.videos.length + 1 - 10
      } more tracks added...\``;
    }

    return new MessageEmbed()
      .setTitle(`🎶 ${plist.videoCount} songs added!`)
      .setColor(10027008)
      .setDescription(plistDescription)
      .setTimestamp();
  }

  /**
   * Display custom messaging
   */
  private displayMessaging(): void {
    const channel = this.getChannel();

    Main.Client.on(
      'voiceStateUpdate',
      (oldState: VoiceState, newState: VoiceState) => {
        if (
          !oldState.member?.user.bot ||
          oldState.channelID === newState.channelID
        ) {
          return undefined;
        }

        const m = {
          move: `👋 **I have successfully moved to another voice channel, ${newState.channel?.name}.**`,
          leave: `👋 **I have left ${oldState.channel?.name}.**`,
          join: `👋 **I have successfully joined ${newState.channel?.name}.**`,
        };

        const state = getVoiceState(oldState, newState);
        const message = this.createVoiceUpdateMessage(m[state]);
        return channel?.send(message);
      }
    );

    const player = Main.Client['player'] as Player;
    player.on('channelEmpty', () => {
      const message = this.createVoiceUpdateMessage(
        '👋 Everyone left the Voice Channel, queue ended.'
      );
      return channel?.send(message);
    });

    player.on('songAdd', ({}, {}, song) => {
      const message = this.createSongUpdateMessage(song);
      return channel?.send(message);
    });

    player.on('playlistAdd', ({}, {}, playlist) => {
      const message = this.createPLaylistAddedMessage(playlist);
      return channel?.send(message);
    });

    player.on('queueEnd', ({}, {}) => {
      const message = this.createVoiceUpdateMessage(
        `⌛ **The queue has ended!**`
      );
      return channel?.send(message);
    });

    player.on('songChanged', ({}, newSong, {}) => {
      const message = this.createSongUpdateMessage(newSong, true);
      return channel?.send(message);
    });

    player.on('songFirst', ({}, song) => {
      const message = this.createSongUpdateMessage(song, true);
      return channel?.send(message);
    });

    player.on('error', (error, {}) => {
      let errorMessage = '🚫 ';
      errorMessage +=
        error === 'SearchIsNull'
          ? '**Oops... I cant find this song**'
          : error === 'InvalidPlaylist'
          ? '**Cant find this playlist!**'
          : error === 'InvalidSpotify'
          ? '**Cant find this song!**'
          : error === 'QueueIsNull'
          ? '**There is no music playing right now.**'
          : error === 'VoiceChannelTypeInvalid'
          ? '**You need to be in a voice channel!**'
          : error === 'LiveUnsupported'
          ? '**We dont support Youtube streams!**'
          : error === 'VideoUnavailable'
          ? '**Error! Skipping song.**'
          : error === 'NotANumber'
          ? '**Not a number?**'
          : error === 'MessageTypeInvalid'
          ? '**Not an object!**'
          : '**Oops! Unknown Error.**';

      const message = this.createVoiceUpdateMessage(errorMessage);
      return channel?.send(message);
    });
  }
}
