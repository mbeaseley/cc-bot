// import { CommandMessage } from 'discordx';
import { environment } from 'Utils/environment';
import {
  EmbedField,
  Guild,
  GuildEmoji,
  GuildEmojiManager,
  GuildManager,
  Message,
  MessageEmbed,
  MessageEmbedOptions,
  Role,
  RoleManager,
  User,
} from 'discord.js';
import _ = require('underscore');

export default class Utility {
  /**
   * Create Field string
   * @param value
   * @returns
   */
  static createFieldValue(value: any): any[] {
    return value.map((v: any) => {
      if (typeof v !== 'string' && v.rarity) {
        return `${v.name} (${v.rarity})`;
      }

      return v;
    });
  }

  /**
   * Create embed messsage
   * @param data
   * @param title
   * @param thumbnail
   * @param excludeKeys
   * @returns
   */
  static createEmbedMessage(
    // eslint-disable-next-line @typescript-eslint/ban-types
    data: Object,
    title: string,
    thumbnail?: string,
    excludeKeys?: string[]
  ): MessageEmbed | MessageEmbedOptions | undefined {
    const fields: EmbedField[] = [];

    Object.entries(data).forEach(([key, value]) => {
      if (excludeKeys?.find((k) => k === key)) return;
      const field: EmbedField = {
        name: (key.charAt(0).toUpperCase() + key.slice(1))
          .replace(/([A-Z])/g, ' $1')
          .trim(),
        value:
          typeof value !== 'string'
            ? this.createFieldValue(value)?.join('\n')
            : value,
        inline: false,
      };

      fields.push(field);
    });

    const embed = new MessageEmbed();
    embed.title = title;
    embed.color = 10181046;
    embed.fields = fields;

    if (thumbnail) {
      embed.setThumbnail(thumbnail);
    }

    return embed;
  }

  /**
   * Get random value or subset of values
   * @param array
   * @param subset
   * @returns
   */
  static random(array: any[], subset?: number): any {
    if (subset) {
      return _.sample(array, subset);
    }

    return array[Math.floor(Math.random() * array.length)];
  }

  /**
   * Get guild
   * @param guilds
   * @returns Guild
   */
  static getGuild(guilds: GuildManager): Guild | undefined {
    return guilds.cache.find((g) => g.id === environment.server);
  }

  /**
   * Checks if every substrings is within copy
   * @param subStrings
   * @param copy
   * @returns boolean
   */
  static checkStatementForStrings(subStrings: string[], copy: string): boolean {
    return subStrings.every((s) => copy.indexOf(s) > -1);
  }

  /**
   * Captalise first letter in phrase
   * @param value
   * @returns string
   */
  static captaliseFirstLetter(value: string): string {
    return value[0].toUpperCase() + value.slice(1);
  }

  /**
   * Get string option from command message
   * @param command
   * @param indexToRemove
   * @param joinCharacter
   * @returns string | string[]
   */
  static getOptionFromCommand(
    command: string,
    indexToRemove: number,
    joinCharacter?: string
  ): string[] | string {
    const array = command.split(' ');
    array.splice(0, indexToRemove);
    return joinCharacter ? array.join(joinCharacter) : array;
  }

  /**
   * Gets author
   * @param command
   * @returns User
   */
  static getAuthor(command: any): User {
    return command.author;
  }

  /**
   * Checks if user is admin
   * @param command
   * @returns boolean
   */
  static isAdmin(command: any): boolean {
    const id = this.getAuthor(command)?.id as string;
    return !!environment.admins.find((a) => a === id);
  }

  /**
   * Sends command message response
   * @param command
   * @param content
   * @param type
   * @param deleteDelay
   * @returns Promise<Message>
   */
  static sendMessage(
    command: any,
    content: string | MessageEmbed,
    type: 'channel' | 'reply' | 'author' = 'channel',
    deleteDelay?: number
  ): Promise<Message> {
    const msg =
      type === 'channel'
        ? command.channel.send(content)
        : type === 'author'
        ? command.author.send(content)
        : command.reply(content);

    return deleteDelay
      ? msg.then((m: any) => m.delete({ timeout: deleteDelay }))
      : msg;
  }

  /**
   * Find emoji
   * @param guildEmojiManager
   * @param emojiName
   * @returns GuildEmoji | undefined
   */
  static findEmoji(
    guildEmojiManager: GuildEmojiManager,
    emojiName: string
  ): GuildEmoji | undefined {
    return guildEmojiManager.cache.find((e) => e.name === emojiName);
  }

  /**
   * Find role
   * @param roleManager
   * @param roleName
   * @returns Role | undefined
   */
  static findRole(
    roleManager: RoleManager | undefined,
    roleName: string | undefined
  ): Role | undefined {
    return roleManager?.cache.find((r) => r.name === roleName);
  }
}
