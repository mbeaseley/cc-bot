import { CommandInteraction } from 'discord.js';
import { Discord, Slash } from 'discordx';

@Discord()
export abstract class Ping {
  @Slash('ping', { description: 'Classic Ping Pong!' })
  async init(interaction: CommandInteraction) {
    return interaction.reply('pong');
  }
}
