import { Command, CommandMessage, Description } from '@typeit/discord';
import { status } from 'minecraft-server-util';
import { StatusResponse } from 'minecraft-server-util/dist/model/StatusResponse';
import { McUrl } from '../types/minecraft';
import { Logger } from '../services/logger.service';
import { Message, MessageAttachment, MessageEmbed } from 'discord.js';

export class Minecraft {
  private logger: Logger;
  private _mcUrl: McUrl | undefined;

  constructor() {
    this.logger = new Logger();
  }

  private get mcUrl() {
    return this._mcUrl ?? new McUrl();
  }

  private set mcUrl(value: McUrl) {
    this._mcUrl = value;
  }

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
        status.description?.descriptionText.replace(/§[a-zA-Z0-9]/g, '')
      )
      .addField(
        'Online Players: ',
        `${status.onlinePlayers}/${status.maxPlayers}`
      );
  }

  @Command('minecraft')
  @Description('Ping a minecraft server for information')
  async init(command: CommandMessage): Promise<Message | void> {
    try {
      const commandArray = command.content.split(' ');
      commandArray.splice(0, 2);
      const urlSplit = commandArray[0]?.split(':');
      let newMcUrl: McUrl = new McUrl();

      if (this.mcUrl.domain) {
        newMcUrl = this.mcUrl.domain
          ? this.mcUrl
          : new McUrl(urlSplit[0], +urlSplit[1] || undefined);
      }

      if (!newMcUrl.domain) {
        await command.delete();
        this.logger.error(
          `Command: 'minecraft' has error: domain and port not defined.`
        );
        return command.channel
          .send('**Incorrect format** Please check help for correct format!')
          .then((m) => m.delete({ timeout: 5000 }));
      }

      if (!newMcUrl.port) {
        newMcUrl.port = 25565;
      }

      const res = await status(newMcUrl.domain, { port: newMcUrl.port });
      const message = this.createMessage(res, newMcUrl);
      await command.delete();
      return command.channel.send(message);
    } catch (e) {
      await command.delete();
      this.logger.error(`Command: 'minecraft' has error: ${e.message}.`);
      return command.channel
        .send(
          `An error has occured. If this error keeps occurring, please contact support.`
        )
        .then((m) => m.delete({ timeout: 5000 }));
    }
  }

  @Command('set minecraft')
  @Description('Set default IP and Port for server')
  async setDefaultInit(command: CommandMessage): Promise<Message | void> {
    try {
      const commandArray = command.content.split(' ');
      commandArray.splice(0, 3);
      const urlSplit = commandArray[0].split(':');

      if (!urlSplit.length) {
        await command.delete();
        this.logger.error(
          `Command: 'minecraft set' has error: domain and port not defined.`
        );
        return command.channel
          .send('**Incorrect format** Please check help for correct format!')
          .then((m) => m.delete({ timeout: 5000 }));
      }

      this.mcUrl = new McUrl(urlSplit[0], +urlSplit[1]);
      await command.delete();
      return command.channel
        .send(`**Minecraft service domain/ip and port have been set!**`)
        .then((m) => m.delete({ timeout: 5000 }));
    } catch (e) {
      await command.delete();
      this.logger.error(`Command: 'minecraft' has error: ${e.message}.`);
      return command.channel
        .send(
          `The following error has occurred: ${e.message}. If this error keeps occurring, please contact support.`
        )
        .then((m) => m.delete({ timeout: 5000 }));
    }
  }
}
