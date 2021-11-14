import { CommandInteraction, MessageEmbed } from 'discord.js';
import { Discord, Slash, SlashOption } from 'discordx';
import * as urban from 'urban-dictionary';
import Translate from '../../utils/translate';

@Discord()
export abstract class Urban {
  /**
   * Create custom message
   * @param phrase
   * @param entry
   */
  private createMessage(
    phrase: string,
    entry: urban.DefinitionObject
  ): MessageEmbed {
    const lower = phrase.toLowerCase();
    const formattedPhrase = phrase.charAt(0).toUpperCase() + lower.slice(1);

    return new MessageEmbed()
      .setTitle(Translate.find('urbanTitle', formattedPhrase))
      .setColor(1079)
      .setURL(entry.permalink)
      .setThumbnail('https://i.imgur.com/LmyPRai.png')
      .setDescription(
        Translate.find('urbanDes', entry.definition, entry.example)
      )
      .addField('👍', entry.thumbs_up.toString(), true)
      .addField('👎', entry.thumbs_down.toString(), true);
  }

  /**
   * Urban Command
   * @param user
   * @param interaction
   */
  @Slash('urban', {
    description: `Get urban definition of word`,
  })
  async init(
    @SlashOption('phrase', {
      description: 'What do you want to search?',
      required: true,
    })
    phrase: string,
    interaction: CommandInteraction
  ): Promise<void> {
    return urban.define(phrase, async (err, entries) => {
      if (err) {
        await interaction.reply(Translate.find('urbanError'));
        await new Promise((resolve) => setTimeout(resolve, 5000));
        return interaction.deleteReply();
      }

      const msg = this.createMessage(phrase, entries[0]);
      return interaction.reply({ embeds: [msg] });
    });
  }
}
