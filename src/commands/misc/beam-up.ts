import { Command, CommandMessage, Description } from '@typeit/discord';
import { Logger } from 'Services/logger.service';
import { environment } from 'Utils/environment';
import Translate from 'Utils/translate';
import Utility from 'Utils/utility';
import {
  GuildChannel,
  GuildChannelManager,
  GuildMember,
  MessageEmbed,
} from 'discord.js';

export class BeamUp {
  private logger: Logger;
  private static _voiceChannel: GuildChannel | undefined;
  private static _member: GuildMember | null;

  constructor() {
    this.logger = new Logger();
  }

  /**
   * Get voice channel
   */
  static get voiceChannel(): GuildChannel | undefined {
    return this._voiceChannel;
  }

  /**
   * Set voice channel
   */
  static set voiceChannel(value: GuildChannel | undefined) {
    this._voiceChannel = value;
  }

  /**
   * Get guild member
   */
  static get member(): GuildMember | null {
    return this._member;
  }

  /**
   * Set guild member
   */
  static set member(value: GuildMember | null) {
    this._member = value;
  }

  /**
   * Allows guild member to join restrictive channel
   */
  public moveMemberToChannel(): Promise<GuildMember> | undefined {
    const vc = BeamUp.voiceChannel;
    if (vc?.id) {
      return BeamUp.member?.voice.setChannel(vc.id.toString());
    }

    return Promise.reject(Translate.find('beamUpFail'));
  }

  /**
   * Find voice channel voice is on
   * @param channels
   * @param userId
   */
  private findUserChannel(
    channels: GuildChannelManager | undefined,
    userId: string
  ): GuildChannel | undefined {
    const voiceChannels = channels?.cache?.filter((c) => c.type === 'voice');

    return voiceChannels?.find((c) => !!c.members.find((m) => m.id === userId));
  }

  /**
   * Create message
   * @param command
   */
  private createMessage(command: CommandMessage): MessageEmbed {
    const member = command.member as GuildMember;
    const user = command.client.user;

    return new MessageEmbed()
      .setColor(member.displayHexColor)
      .setAuthor(Translate.find('beamUpAuthor'), user?.displayAvatarURL())
      .setDescription(Translate.find('beamUpDescription'));
  }

  /**
   * Init
   * @param command
   */
  @Command('beam up')
  @Description('Beam up member to restrictive voice channel')
  async init(command: CommandMessage): Promise<any> {
    try {
      if (command.deletable) await command.delete();

      const voiceChannels = environment.admins
        .map((a) => this.findUserChannel(command.guild?.channels, a))
        .filter(Boolean) as GuildChannel[];
      const voiceChannel = [...new Set(voiceChannels)];

      if (!voiceChannel.length) {
        return Utility.sendMessage(
          command,
          Translate.find('beamUpNotRestrictive'),
          'channel',
          5000
        );
      }

      BeamUp.voiceChannel = voiceChannel[0];
      BeamUp.member = command.member;
      const author = Utility.getAuthor(command);

      const permission = BeamUp.voiceChannel
        ?.permissionsFor(author)
        ?.has('CONNECT', false);

      if (permission) {
        return Utility.sendMessage(
          command,
          Translate.find('beamUpPermission'),
          'channel',
          5000
        );
      }

      const e = Utility.findEmoji(command.client.emojis, 'ufo');
      if (!e?.name) {
        return Utility.sendMessage(
          command,
          Translate.find('beamUpNoEmoji'),
          'channel',
          5000
        );
      }

      const message = this.createMessage(command);
      return Utility.sendMessage(command, message).then((msg) => {
        msg.react(`${e?.name}:${e?.id}`);
      });
    } catch (e: unknown) {
      if (command.deletable) await command.delete();
      this.logger.error(
        Translate.find('errorLog', 'beam up', (e as Error).message)
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
