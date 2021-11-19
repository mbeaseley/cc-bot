import { CommandInteraction, MessageEmbed } from 'discord.js';
import { Discord, MetadataStorage, Slash } from 'discordx';
import { Pagination } from '@discordx/utilities';

@Discord()
export abstract class Help {
  /**
   * Help Command
   * @param interaction
   */
  @Slash('help', { description: 'Pagination for all slash command' })
  async init(interaction: CommandInteraction): Promise<void> {
    const commands = MetadataStorage.instance.applicationCommands.map((cmd) => {
      return { name: cmd.name, description: cmd.description };
    });

    const pages = commands.map((cmd, i) => {
      return new MessageEmbed()
        .setFooter(`Page ${i + 1} of ${commands.length}`)
        .setAuthor(
          'Slash command info',
          interaction.client.user?.displayAvatarURL()
        )
        .setColor(10181046)
        .addField('Name', cmd.name)
        .addField('Description', cmd.description);
    });

    const pagination = new Pagination(interaction, pages);
    await pagination.send();
  }
}
