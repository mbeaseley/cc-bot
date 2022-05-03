import { complimentService } from 'Services/compliment.service';
import { insultService } from 'Services/insult.service';
import { Command } from 'Utils/command';
import { ClientUser, CommandInteraction, MessageEmbed } from 'discord.js';
import { Discord, Slash, SlashOption } from 'discordx';

@Discord()
export abstract class SayIt extends Command {
  constructor() {
    super();
  }

  /**
   * Create Message for say it command
   * @param copy
   * @param user
   * @returns MessageEmbed
   */
  private createMessage(copy: string, user: ClientUser | null): MessageEmbed {
    return new MessageEmbed()
      .setAuthor({ name: this.c('sayItTitle'), iconURL: user?.displayAvatarURL() })
      .setColor('RANDOM')
      .setDescription(copy);
  }

  /**
   * Say It Command
   * @param user
   * @param interaction
   */
  @Slash('say-it', {
    description: `fun command to try your luck, get or send a user with a insult or compliment!`
  })
  async init(
    @SlashOption('user', {
      description: 'Who do you want to send this to?',
      required: false
    })
    user: string,
    interaction: CommandInteraction
  ): Promise<void> {
    const index = Math.round(Math.random());

    const copy = index
      ? await complimentService.getCompliment().then((c) => {
          return c.compliment;
        })
      : await insultService.getInsult().then((i) => i);

    if (!copy) {
      await interaction.reply(this.c('noSayIt'));
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return interaction.deleteReply();
    }

    const copyString = user ? `${user}, ${copy}` : copy;
    const msg = this.createMessage(copyString, interaction.client.user);
    return interaction.reply({ embeds: [msg] });
  }
}
