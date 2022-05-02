import { Command } from 'Utils/command';
import { ApplicationCommandOption, CommandInteraction, MessageEmbed } from 'discord.js';
import { Discord, Slash, SlashChoice, SlashOption } from 'discordx';

@Discord()
export class allCommands extends Command {
  constructor() {
    super();
  }

  /**
   * Create message
   * @returns MessageEmbed
   */
  private createMessage(selection: string, content: string, iconURL?: string): MessageEmbed {
    return new MessageEmbed()
      .setAuthor({ name: `${selection} Slash Commands`, iconURL })
      .setColor(7513300)
      .setDescription(content);
  }

  @Slash('all-commands', { description: 'miscellaneous command to display all possible commands' })
  async init(
    @SlashChoice('Fun', 'dbd')
    @SlashChoice('image', 'miscellaneous')
    @SlashChoice('moderator', 'searcher')
    @SlashOption('selection', {
      description: 'Do you want the challenge to be dm only to you?'
    })
    selection: string,
    interaction: CommandInteraction
  ): Promise<void> {
    try {
      const { client, guild } = interaction;
      const g = await guild?.fetch();

      const commands = g?.commands.cache
        .filter((c) => c.description.toLowerCase().split(' ')?.[0] === selection.toLowerCase())
        .toJSON();

      if (!commands) {
        throw new Error();
      }

      let commandOptions: ApplicationCommandOption[] | undefined;
      if (!commands.length) {
        const c = g?.commands.cache.filter((c) => c.name.indexOf(selection.toLowerCase()) > -1);
        commandOptions = c?.first()?.options;
      }

      const commandsUsed = commandOptions?.length ? commandOptions : commands;
      const content = commandsUsed
        .map((c) => {
          return commandOptions?.length
            ? `\`/${selection} ${c.name}\`\n${c.description}\n\n`
            : `\`/${c.name}\`\n${c.description}\n\n`;
        })
        .join('');

      const msg = this.createMessage(selection, content, client.user?.displayAvatarURL());
      return interaction.reply({ embeds: [msg] });
    } catch (e: unknown) {
      await interaction.reply(this.c('unexpectedError'));
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return interaction.deleteReply();
    }
  }
}
