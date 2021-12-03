import {
  ButtonInteraction,
  CommandInteraction,
  GuildCacheMessage,
  MessageActionRow,
  MessageButton
} from 'discord.js';
import { ButtonComponent, Discord, Slash } from 'discordx';

type Coin = 'Heads' | 'Tails';

@Discord()
export abstract class CoinFlip {
  /**
   * Create message
   * @param guess
   * @param result
   * @returns string
   */
  createMessage(guess: Coin, result: Coin): string {
    const guessResult = `${result === guess ? 'You win!' : 'You lose!'}`;
    return `**${result}, ${guessResult} :coin:**`;
  }

  /**
   * Coin flip Command
   * @param interaction
   */
  @Slash('flip', { description: `Flip a coin` })
  async init(interaction: CommandInteraction): Promise<GuildCacheMessage<any> | void> {
    await interaction.deferReply();

    const headsBtn = new MessageButton()
      .setLabel('Heads')
      .setEmoji('🪙')
      .setStyle('PRIMARY')
      .setCustomId('heads-btn');

    const tailsBtn = new MessageButton()
      .setLabel('Tails')
      .setEmoji('🪙')
      .setStyle('SECONDARY')
      .setCustomId('tails-btn');

    const row = new MessageActionRow().addComponents([headsBtn, tailsBtn]);

    return interaction.editReply({
      content: `Heads or Tails?`,
      components: [row]
    });
  }

  /**
   * Heads Button Interaction
   * @param interaction
   */
  @ButtonComponent('heads-btn')
  headsAction(interaction: ButtonInteraction): Promise<void> {
    const coinFlip = Math.floor(Math.random() * 2) === 0 ? 'Heads' : 'Tails';
    const res = this.createMessage('Heads', coinFlip);
    return interaction.reply(res);
  }

  /**
   * Tails Button Interaction
   * @param interaction
   */
  @ButtonComponent('tails-btn')
  tailsAction(interaction: ButtonInteraction): Promise<void> {
    const coinFlip = Math.floor(Math.random() * 2) === 0 ? 'Heads' : 'Tails';
    const res = this.createMessage('Tails', coinFlip);
    return interaction.reply(res);
  }
}
