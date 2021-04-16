import { EmbedField, MessageEmbed, MessageEmbedOptions } from 'discord.js';
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
}
