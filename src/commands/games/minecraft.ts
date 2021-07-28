import { Command, CommandMessage, Description } from '@typeit/discord';
import { Logger } from 'Services/logger.service';
import { MinecraftService } from 'Services/minecraft.service';
import { McServerDetail, McUrl } from 'Types/minecraft';
import Utility from 'Utils/utility';
import { Message, MessageAttachment, MessageEmbed } from 'discord.js';
import { status } from 'minecraft-server-util';
import { StatusResponse } from 'minecraft-server-util/dist/model/StatusResponse';

export class Minecraft {
  private logger: Logger;
  private minecraftService: MinecraftService;
  private _mcUrl: McUrl | undefined;

  constructor() {
    this.logger = new Logger();
    this.minecraftService = new MinecraftService();
  }

  /**
   * Get Minecraft domain/ip and port
   */
  private get mcUrl() {
    return this._mcUrl ?? new McUrl();
  }

  /**
   * Set Minecraft domain/ip and port
   */
  private set mcUrl(value: McUrl) {
    this._mcUrl = value;
  }

  /**
   * Create Message
   * @param status
   * @param mcUrl
   */
  private createMessage(status: StatusResponse, mcUrl: McUrl): MessageEmbed {
    let imageStream: Buffer = Buffer.from('');

    if (status.favicon) {
      imageStream = Buffer.from(
        status.favicon.split(',').slice(1).join(','),
        'base64'
      );
    }

    const attachment = new MessageAttachment(imageStream, 'favicon.png');

    return new MessageEmbed()
      .setColor(0x00cc06)
      .setTitle('Minecraft Server Status')
      .attachFiles(status.favicon ? [attachment] : [])
      .setThumbnail(status.favicon ? 'attachment://favicon.png' : '')
      .setURL(`https://mcsrvstat.us/server/${mcUrl.domain}:${mcUrl.port}`)
      .addField('Server IP/Port:', `${status.host}:${status.port}`)
      .addField('Server Version: ', status.version)
      .addField(
        'Description: ',
        status.description?.descriptionText.replace(/§[a-zA-Z0-9]/g, '') || '~'
      )
      .addField(
        'Online Players: ',
        `${status.onlinePlayers}/${status.maxPlayers}`
      );
  }

  /**
   * Set minecraft url object
   * @param guildId
   * @param url
   */
  private async setMinecraftUrl(
    guildId: string,
    url?: string[]
  ): Promise<McUrl> {
    let server: McUrl = new McUrl();

    if (url?.length) {
      server = new McUrl(url[0], +url[1] || undefined);
    }

    if (!server.domain) {
      server = this.mcUrl;
    }

    if (!server.domain) {
      const res = await this.minecraftService.getServerDetails(guildId);
      server = res?.domain ? new McUrl(res.domain, +res.port) : new McUrl();
    }

    return Promise.resolve(server);
  }

  /**
   * Ping minecraft server
   * @param command
   */
  @Command('minecraft')
  @Description('Ping a minecraft server for information')
  async init(command: CommandMessage): Promise<Message | void> {
    try {
      const commandArray = Utility.getOptionFromCommand(command.content, 2);
      const urlSplit = commandArray[0]?.split(':');
      const newMcUrl: McUrl = await this.setMinecraftUrl(
        command.guild?.id || '',
        urlSplit
      );

      if (!newMcUrl.domain) {
        if (command.deletable) await command.delete();
        this.logger.error(
          `Command: 'minecraft' has error: domain and port not defined.`
        );
        return Utility.sendMessage(
          command,
          '**Incorrect format** Please check help for correct format!',
          'channel',
          5000
        );
      }

      const fetchingMsg = await Utility.sendMessage(
        command,
        `⏳ Fetching ${newMcUrl.domain}:${newMcUrl.port} server info...`
      );

      const res = await status(newMcUrl.domain, {
        port: newMcUrl.port || 25565,
      }).catch(() => {
        return undefined;
      });

      if (command.deletable) await command.delete();
      await fetchingMsg.delete();

      if (!res) {
        return Utility.sendMessage(
          command,
          `**This server doesn't exist**`,
          'channel',
          5000
        );
      }

      const message = this.createMessage(res, newMcUrl);
      return Utility.sendMessage(command, message);
    } catch (e: unknown) {
      if (command.deletable) await command.delete();
      this.logger.error(
        `Command: 'minecraft' has error: ${(e as Error).message}.`
      );
      return Utility.sendMessage(
        command,
        `An error has occured. Most likely you haven't set your ip/domain and port correctly. If this error keeps occurring, please contact support.`,
        'channel',
        5000
      );
    }
  }

  /**
   * Find server on guild and sets or updates on command
   * @param guildId
   * @param mcUrl
   */
  private async getAndSetServer(guildId: string, mcUrl: McUrl): Promise<void> {
    const serverUrl = (await this.minecraftService.getServerDetails(
      guildId
    )) as McServerDetail;

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
   * Set Minecraft server
   * @param command
   */
  @Command('set minecraft')
  @Description('Set default IP and Port for server')
  async setDefaultInit(command: CommandMessage): Promise<Message | void> {
    try {
      const commandArray = Utility.getOptionFromCommand(command.content, 3);
      const urlSplit = commandArray[0].split(':');

      if (!urlSplit.length) {
        if (command.deletable) await command.delete();
        this.logger.error(
          `Command: 'minecraft set' has error: domain and port not defined.`
        );
        return Utility.sendMessage(
          command,
          '**Incorrect format** Please check help for correct format!',
          'channel',
          5000
        );
      }

      this.mcUrl = new McUrl(urlSplit[0], +urlSplit[1]);

      if (!command.guild?.id) {
        if (command.deletable) await command.delete();
        this.logger.error(`Command: 'minecraft set' has error: no guild id`);
        return Utility.sendMessage(
          command,
          '**No guild Id found!**',
          'channel',
          5000
        );
      }

      await this.getAndSetServer(command.guild.id, this.mcUrl);

      if (command.deletable) await command.delete();
      return Utility.sendMessage(
        command,
        '**Minecraft service domain/ip and port have been set!**',
        'channel',
        5000
      );
    } catch (e: unknown) {
      if (command.deletable) await command.delete();
      this.logger.error(
        `Command: 'minecraft' has error: ${(e as Error).message}.`
      );
      return Utility.sendMessage(
        command,
        `The following error has occurred: ${
          (e as Error).message
        }. If this error keeps occurring, please contact support.`,
        'channel',
        5000
      );
    }
  }
}
