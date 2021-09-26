import { CommandMessage } from '@typeit/discord';
import { Main } from 'Root/main';
import { getVoiceState } from 'Types/music';
import { environment } from 'Utils/environment';
import Utility from 'Utils/utility';
import {
  GuildMember,
  Message,
  MessageEmbed,
  TextChannel,
  VoiceChannel,
  VoiceState,
} from 'discord.js';
import { Player, Playlist, Song } from 'discord-music-player';

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

  get player(): Player {
    return Main.Client['player'] as Player;
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
    return res ? this.player.play(command, query) : Promise.resolve();
  }

  /**
   * Add playlist
   * @param command
   * @param query
   */
  public async addPlaylist(
    command: CommandMessage,
    query: string
  ): Promise<any | void> {
    const res = await this.join(command);
    return res ? this.player.playlist(command, query) : Promise.resolve();
  }

  /**
   * Stop and clear player quene
   * @param command
   */
  public async stop(command: CommandMessage): Promise<Song | void> {
    const active = this.isBotActive(command);

    return active ? this.player.stop(command) : Promise.resolve();
  }

  /**
   * Pause current music
   * @param command
   */
  public async pause(command: CommandMessage): Promise<Message | void> {
    const active = this.isBotActive(command);
    return Promise.resolve().then(() => {
      if (active) {
        this.player.resume(command);

        const channel = this.getChannel();
        const message = this.createVoiceUpdateMessage('⏸️  **Paused!**');
        return channel.send(message);
      }

      return;
    });
  }

  /**
   * Resume current music
   * @param command
   */
  public async resume(command: CommandMessage): Promise<Message | void> {
    const active = this.isBotActive(command);

    return Promise.resolve().then(() => {
      if (active) {
        this.player.resume(command);

        const channel = this.getChannel();
        const message = this.createVoiceUpdateMessage('▶️ **Resumed!**');
        return channel.send(message);
      }

      return;
    });
  }

  /**
   * Shuffle Queue
   * @param command
   */
  public async shuffle(command: CommandMessage): Promise<Message | void> {
    const active = this.isBotActive(command);

    return Promise.resolve().then(async () => {
      if (active) {
        this.player.shuffle(command);

        const channel = this.getChannel();
        const message = this.createVoiceUpdateMessage(
          '🔀  **Server Queue is shuffled!**'
        );
        await channel.send(message);
        return this.getQueue(command);
      }

      return;
    });
  }

  /**
   * Set volume
   * @param command
   */
  public async setVolume(
    command: CommandMessage,
    value: number
  ): Promise<Song> {
    return Promise.resolve(this.player.setVolume(command, value));
  }

  /**
   * Get current queue
   * @param command
   */
  public async getQueue(command: CommandMessage): Promise<Message> {
    const queue = this.player.getQueue(command);

    const channel = this.getChannel();

    if (queue?.songs.length < 1) {
      const msg = this.createVoiceUpdateMessage('🚫  Nothing in queue!');
      return channel?.send(msg);
    }

    const message = this.createPlaylistAddedMessage(queue?.songs || []);
    return channel?.send(message);
  }

  /**
   * Clear Queue
   * @param command
   */
  public async clearQueue(command: CommandMessage): Promise<Message> {
    this.player.clearQueue(command);

    const channel = this.getChannel();
    const msg = this.createVoiceUpdateMessage('🚫  Nothing in queue!');
    return channel?.send(msg);
  }

  /**
   * Toggle repeat of queue
   * @param command
   * @param value
   */
  public async setQueueRepeatMode(
    command: CommandMessage,
    value: boolean
  ): Promise<Message> {
    this.player.setQueueRepeatMode(command, value);

    const channel = this.getChannel();
    const msg = this.createVoiceUpdateMessage(
      `🎶 Queue set to ${!value ? 'not ' : ''}repeat`
    );
    return channel?.send(msg);
  }

  /**
   * Toggle loop of queue
   * @param command
   * @param value
   */
  public async toggleQueueLoop(command: CommandMessage): Promise<Message> {
    const loop = this.player.toggleQueueLoop(command);

    const channel = this.getChannel();
    const msg = this.createVoiceUpdateMessage(
      `🎶 Queue set to ${!loop ? 'not ' : ''}repeat`
    );
    return channel?.send(msg);
  }

  /**
   * Toggle repeat of current playing song
   * @param command
   * @param value
   */
  public async setRepeatMode(
    command: CommandMessage,
    value: boolean
  ): Promise<Message> {
    const loop = this.player.setRepeatMode(command, value);

    const channel = this.getChannel();
    const msg = this.createVoiceUpdateMessage(
      `🎶 Queue set to ${!loop ? 'not ' : ''}repeat`
    );
    return channel?.send(msg);
  }

  /**
   * Skip current playing song
   * @param command
   * @param value
   */
  public async skip(command: CommandMessage): Promise<Message> {
    const song = this.player.skip(command);

    const channel = this.getChannel();
    const msg = this.createVoiceUpdateMessage(
      `⏭️ ${song.name} has been skipped!`
    );
    return channel?.send(msg);
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

  /**
   * Create song update message
   * @param song
   * @param now
   */
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

  /**
   * Create playlsit added message
   * @param playlist
   */
  private createPlaylistAddedMessage(playlist: any): MessageEmbed {
    let plist: Playlist = {
      name: '',
      author: '',
      url: '',
      videos: [],
      videoCount: 0,
    };
    let songs: Song[] = [];

    if (playlist?.videos) {
      plist = playlist;
    } else {
      songs = playlist;
    }

    let plistDescription = (songs.length ? songs : plist.videos)
      .map((v: Song, i: number) => {
        if (i < 10) {
          return `\`${i + 1}\` [${v.name} - ${v.duration}](${v.url})\n`;
        }
        return '';
      })
      .join('');

    const moreSongs = (plist.videos || songs).length + 1 - 10;
    if (moreSongs > 0) {
      plistDescription += `\`\n\n${moreSongs} more tracks added...\``;
    }

    return new MessageEmbed()
      .setTitle(
        songs.length
          ? `🎶  Song Queue!`
          : plist.videoCount > 0
          ? `🎶  ${plist.videoCount} songs added!`
          : `🚫  Nothing In Queue!`
      )
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
      const message = this.createPlaylistAddedMessage(playlist);
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
