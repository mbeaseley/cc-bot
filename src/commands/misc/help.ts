import { Command } from 'Utils/command';
import { Pagination } from '@discordx/pagination';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import { Discord, MetadataStorage, Slash } from 'discordx';

@Discord()
export abstract class Help extends Command {
  constructor() {
    super();
  }

  /**
   * Help Command
   * @param interaction
   */
  @Slash('help', {
    description: 'Pagination for all slash command.'
  })
  async init(interaction: CommandInteraction): Promise<void> {
    const commands = MetadataStorage.instance.applicationCommands.map((cmd) => {
      return { name: cmd.name, description: cmd.description };
    });

    const pages = commands.map((cmd, i) => {
      return new MessageEmbed()
        .setFooter({ text: this.c('helpFooter', (i + 1).toString(), commands.length.toString()) })
        .setAuthor({
          name: this.c('helpHeading'),
          iconURL: interaction.client.user?.displayAvatarURL()
        })
        .setColor(10181046)
        .addField(this.c('helpName'), cmd.name)
        .addField(this.c('helpDescription'), cmd.description);
    });

    const pagination = new Pagination(interaction, pages);
    await pagination.send();
  }
}
