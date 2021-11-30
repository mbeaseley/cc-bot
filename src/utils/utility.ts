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
  User
} from 'discord.js';
import * as _ from 'underscore';

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
  ): MessageEmbed {
    const fields: EmbedField[] = [];

    Object.entries(data).forEach(([key, value]) => {
      if (excludeKeys?.find((k) => k === key)) return;
      const field: EmbedField = {
        name: (key.charAt(0).toUpperCase() + key.slice(1)).replace(/([A-Z])/g, ' $1').trim(),
        value: typeof value !== 'string' ? this.createFieldValue(value)?.join('\n') : value,
        inline: false
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
    return guilds.cache.find((g) => g.id === process.env.SERVER);
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
