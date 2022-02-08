import { BeamUpItem } from 'Types/beam-up';
import { environment } from 'Utils/environment';
import Translate from 'Utils/translate';
import {
  ButtonInteraction,
  ClientUser,
  Collection,
  CommandInteraction,
  GuildCacheMessage,
  GuildChannel,
  GuildChannelManager,
  GuildMember,
  MessageActionRow,
  MessageButton,
  MessageEmbed
} from 'discord.js';
import { ButtonComponent, Discord, Slash } from 'discordx';

@Discord()
export abstract class BeamUp {
  private _beamUpItem: BeamUpItem | undefined;
  private author: GuildMember | undefined;
  private previousInteraction: CommandInteraction | undefined;

  /**
   * Get beamUpItem
   */
  get beamUpItem(): BeamUpItem | undefined {
    return this._beamUpItem ?? undefined;
  }

  /**
   * Set beamUpItem
   */
  set beamUpItem(value: BeamUpItem | undefined) {
    this._beamUpItem = value;
  }

  /**
   * Find voice channel voice is on
   * @param channels
   * @param userId
   */
  private findUserChannel(
    channels: GuildChannelManager | undefined,
    member: GuildMember
  ): GuildChannel | undefined {
    const voiceChannels = channels?.cache?.filter(
      (c) => c.isVoice() && c.type === 'GUILD_VOICE'
    ) as Collection<string, GuildChannel>;

    return voiceChannels.find((c) => c.isVoice() && c.id === member.voice.channelId);
  }

  /**
   * Create message
   * @param command
   */
  private createMessage(description: string, member?: GuildMember, bot?: ClientUser): MessageEmbed {
    return new MessageEmbed()
      .setColor(member?.displayHexColor ?? 11166957)
      .setAuthor(Translate.find('beamUpAuthor'), bot?.displayAvatarURL())
      .setDescription(description);
  }

  /**
   * Beam Up Command
   * @param interaction
   */
  @Slash('beam-up', {
    description: 'Beam up member to restrictive voice channel!'
  })
  async init(interaction: CommandInteraction): Promise<any> {
    this.previousInteraction = interaction;
    const { member, guild, client } = interaction;
    const members = await guild?.members.fetch();
    const user = members?.find((m) => m.id === member?.user.id);

    if (!user?.id) {
      const noRestrictmsg = this.createMessage(
        `**Sorry, I was unable to find you!**`,
        this.author,
        client.user ?? undefined
      );
      await interaction.reply({ embeds: [noRestrictmsg] });
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return interaction.deleteReply();
    }

    const mods = environment.moderatorRoles.map((m) => m.id);
    const voiceChannels = members
      ?.filter((m) => !!m.roles.cache.find((r) => mods.indexOf(r.id) > -1))
      .map((a) => this.findUserChannel(guild?.channels, a))
      .filter(Boolean)
      .filter((c) => !c?.permissionsFor(user).has('CONNECT', false));

    this.author = user;
    const validChannels = [...new Set(voiceChannels)];

    if (!validChannels.length) {
      const noRestrictmsg = this.createMessage(
        Translate.find('beamUpNotRestrictive'),
        this.author,
        client.user ?? undefined
      );
      await interaction.reply({ embeds: [noRestrictmsg] });
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return interaction.deleteReply();
    }

    await interaction.deferReply();

    this.beamUpItem = new BeamUpItem(validChannels[0], user);
    const msg = this.createMessage(
      Translate.find('beamUpDescription', member?.user.id ?? '~'),
      this.author,
      client.user ?? undefined
    );

    const acceptBtn = new MessageButton()
      .setLabel('Accept')
      .setEmoji('✅')
      .setStyle('PRIMARY')
      .setCustomId('accept-btn');

    const rejectBtn = new MessageButton()
      .setLabel('Reject')
      .setEmoji('🛑')
      .setStyle('SECONDARY')
      .setCustomId('reject-btn');

    const row = new MessageActionRow().addComponents([acceptBtn, rejectBtn]);

    return interaction.editReply({
      embeds: [msg],
      components: [row]
    });
  }

  /**
   * Check if moderator based on roles
   * @param interaction
   * @returns Promise<boolean>
   */
  private async isModerator(interaction: ButtonInteraction): Promise<boolean> {
    const { member, guild } = interaction;
    const members = await guild?.members.fetch();
    const user = members?.find((m) => m.id === member?.user.id);
    return !!user?.roles.cache.find((r) => r.id === environment.moderatorRoles[0].id);
  }

  /**
   * Allows guild member to join restrictive channel
   */
  private async moveMemberToChannel(): Promise<GuildMember | void> {
    const vc = this.beamUpItem?.voiceChannel;
    if (vc?.id && this.author?.id) {
      return this.beamUpItem?.member?.voice.setChannel(vc.id.toString());
    }

    return Promise.resolve();
  }

  /**
   * Accept Action Button
   * @param interaction
   */
  @ButtonComponent('accept-btn')
  async acceptAction(interaction: ButtonInteraction): Promise<void> {
    const isMod = await this.isModerator(interaction);
    if (!isMod) {
      return Promise.resolve();
    }

    await this.moveMemberToChannel();
    await this.previousInteraction?.deleteReply();
    const msg = this.createMessage(
      `<@${this.author?.id}>, request was accepted!`,
      this.author,
      interaction.client.user ?? undefined
    );
    await interaction.reply({ embeds: [msg] });
    await new Promise((resolve) => setTimeout(resolve, 10000));
    return interaction.deleteReply();
  }

  /**
   * Reject Action Button
   * @param interaction
   */
  @ButtonComponent('reject-btn')
  async rejectAction(interaction: ButtonInteraction): Promise<void> {
    const isMod = await this.isModerator(interaction);
    if (!isMod) {
      return Promise.resolve();
    }

    await this.previousInteraction?.deleteReply();
    const msg = this.createMessage(
      `<@${this.author?.id}>, request was rejected!`,
      this.author,
      interaction.client.user ?? undefined
    );
    await interaction.reply({ embeds: [msg] });
    await new Promise((resolve) => setTimeout(resolve, 10000));
    return interaction.deleteReply();
  }
}
