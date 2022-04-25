import { Logger } from 'Services/logger.service';
import { MinecraftService } from 'Services/minecraft.service';
import { McServerDetail, McUrl } from 'Types/minecraft';
import { Command } from 'Utils/command';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import { Discord, Slash, SlashGroup, SlashOption } from 'discordx';
import { status } from 'minecraft-server-util';
import { StatusResponse } from 'minecraft-server-util/dist/model/StatusResponse';

@Discord()
@SlashGroup({ name: 'minecraft', description: 'Minecraft Commands' })
@SlashGroup('minecraft')
export abstract class Minecraft extends Command {
  private minecraftService: MinecraftService;
  private logger: Logger;

  constructor() {
    super();
    this.minecraftService = new MinecraftService();
    this.logger = new Logger();
  }

  /**
   * Find minecraft server
   * @param guildId
   * @param server
   * @returns Promise<McUrl>
   */
  private async findMcUrl(guildId: string, server: McUrl): Promise<McUrl> {
    if (!server.domain && guildId) {
      const res = await this.minecraftService.getServerDetails(guildId.toString());
      return Promise.resolve(new McUrl(res?.domain, res?.port ? +res.port : 25565));
    }

    return Promise.resolve(server ?? new McUrl());
  }

  /**
   * Create Message
   * @param status
   * @param mcUrl
   */
  private createMessage(status: StatusResponse): MessageEmbed {
    return new MessageEmbed()
      .setColor(0x00cc06)
      .setTitle(this.c('mcTitle'))
      .setThumbnail(status.favicon ? this.c('mcThumbnail', 'attachment://favicon.png') : '')
      .setURL(this.c('mcUrl'))
      .addField(this.c('mcServerTitle'), this.c('mcIp', status.host, status.port.toString()))
      .addField(this.c('mcVersion'), status.version ?? '~')
      .addField(this.c('mcOnline'), `${status.onlinePlayers}/${status.maxPlayers}`);
  }

  /**
   * Get minecraft server command
   * @param ip
   * @param port
   * @param interaction
   */
  @Slash('ping', {
    description:
      'Ping a minecraft server for information. Command: /minecraft ip(optional) port(optional)'
  })
  async getMCServer(
    @SlashOption('ip', {
      description: 'IP of your minecraft server ',
      required: false
    })
    ip: string,
    @SlashOption('port', {
      description: 'Port of your minecraft server ',
      required: false
    })
    port: string,
    interaction: CommandInteraction
  ): Promise<any> {
    const server = await this.findMcUrl(interaction.guild?.id ?? '', new McUrl(ip, +port ?? 25565));

    if (!server.domain) {
      await interaction.reply(this.c('mcFormatError'));
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return interaction.deleteReply();
    }

    await interaction.deferReply();
    const res = await status(server.domain, {
      port: server.port || 25565
    }).catch(() => undefined);

    if (!res) {
      await interaction.followUp(this.c('mcFormatError'));
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return interaction.deleteReply();
    }

    const msg = this.createMessage(res);
    return interaction.followUp({ embeds: [msg] });
  }

  /**
   * Find server on guild and sets or updates on command
   * @param guildId
   * @param mcUrl
   */
  private async getAndSetServer(guildId: string, mcUrl: McUrl): Promise<void> {
    const serverUrl = (await this.minecraftService.getServerDetails(guildId)) as McServerDetail;

    return serverUrl
      ? this.minecraftService.updateServerDetails(
          guildId,
          mcUrl.domain,
          mcUrl.port?.toString() || '25565'
        )
      : this.minecraftService.setServerDetails(
          guildId,
          mcUrl.domain,
          mcUrl.port?.toString() || '25565'
        );
  }

  /**
   * Set minecraft server for guild command
   * @param ip
   * @param port
   * @param interaction
   */
  @Slash('set', {
    description: 'Set default IP and Port for server. '
  })
  async setMCServer(
    @SlashOption('ip', {
      description: 'IP of your minecraft server '
    })
    ip: string,
    @SlashOption('port', {
      description: 'Port of your minecraft server ',
      required: false
    })
    port: string,
    interaction: CommandInteraction
  ): Promise<void> {
    const server = new McUrl(ip, +port ?? 25565);

    if (!interaction.guild?.id) {
      await interaction.reply(this.c('mcNoGuild'));
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return interaction.deleteReply();
    }

    await this.getAndSetServer(interaction.guild.id, server);

    await interaction.reply(this.c('mcIpSet'));
    await new Promise((resolve) => setTimeout(resolve, 5000));
    return interaction.deleteReply();
  }
}
