import { CommandMessage } from '@typeit/discord';
import { Main } from 'Root/main';
import Utility from 'Utils/utility';
import { GuildMember, VoiceChannel, VoiceState } from 'discord.js';
import { Player, Playlist, Song } from 'discord-music-player';

export class MusicService {
  constructor() {}

  /**
   * Music player init
   */
  public init(): void {
    const player = new Player(Main.Client, {
      leaveOnEmpty: true,
      volume: 20,
    });

    Main.Client['player'] = player;
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

  // public skip(command: CommandMessage, songId: any): Promise<Song | void> {
  //   const active = this.isBotActive(command);

  //   return active
  //     ? Main.Client['player'].skip(command, songId)
  //     : Promise.resolve();
  // }
}
