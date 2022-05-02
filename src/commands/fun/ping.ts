import { Command } from 'Utils/command';
import { CommandInteraction } from 'discord.js';
import { Discord, Slash } from 'discordx';

@Discord()
export abstract class Ping extends Command {
  @Slash('ping', { description: 'fun command if classic Ping Pong is your thing!' })
  async init(interaction: CommandInteraction) {
    return interaction.reply(this.c('pong'));
  }
}
