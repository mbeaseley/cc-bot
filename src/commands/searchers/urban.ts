import { Command } from 'Utils/command';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import { Discord, Slash, SlashOption } from 'discordx';
import * as urban from 'urban-dictionary';

@Discord()
export abstract class Urban extends Command {
  /**
   * Create custom message
   * @param phrase
   * @param entry
   */
  private createMessage(phrase: string, entry: urban.DefinitionObject): MessageEmbed {
    const lower = phrase.toLowerCase();
    const formattedPhrase = phrase.charAt(0).toUpperCase() + lower.slice(1);

    return new MessageEmbed()
      .setTitle(this.c('urbanTitle', formattedPhrase))
      .setColor(1079)
      .setURL(entry.permalink)
      .setThumbnail('https://i.imgur.com/LmyPRai.png')
      .setDescription(this.c('urbanDes', entry.definition, entry.example))
      .addField('👍', entry.thumbs_up.toString(), true)
      .addField('👎', entry.thumbs_down.toString(), true);
  }

  /**
   * Urban Command
   * @param user
   * @param interaction
   */
  @Slash('urban', {
    description: `searcher command to get urban definition of a word/phrase.`
  })
  async init(
    @SlashOption('phrase', {
      description: 'What do you want to search?'
    })
    phrase: string,
    interaction: CommandInteraction
  ): Promise<void> {
    return urban.define(phrase, async (err, entries) => {
      if (err) {
        await interaction.reply(this.c('urbanError'));
        await new Promise((resolve) => setTimeout(resolve, 5000));
        return interaction.deleteReply();
      }

      const msg = this.createMessage(phrase, entries[0]);
      return interaction.reply({ embeds: [msg] });
    });
  }
}
