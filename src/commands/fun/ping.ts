import { CommandInteraction } from 'discord.js';
import { Discord, Slash } from 'discordx';

@Discord()
export abstract class Ping {
  @Slash('ping')
  async init(interaction: CommandInteraction) {
    return interaction.reply('pong');
  }
}
