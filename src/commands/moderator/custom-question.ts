import { hasPermission } from 'Guards/has-permission';
import { reactionService } from 'Services/reaction.service';
import { rulesService } from 'Services/rules.service';
import { QuestionMessage } from 'Types/question';
import { Command } from 'Utils/command';
import { environment } from 'Utils/environment';
import Utility from 'Utils/utility';
import {
  BaseGuildEmojiManager,
  ClientUser,
  CommandInteraction,
  GuildEmoji,
  Message,
  MessageEmbed,
  RoleManager
} from 'discord.js';
import { Discord, Permission, Slash, SlashChoice, SlashOption } from 'discordx';

const QUESTION_TYPES = ['rules', 'game roles'];

@Discord()
@Permission(false)
@Permission({
  id: environment.ownerId,
  type: 'USER',
  permission: true
})
@Permission(hasPermission(environment.moderatorRoles))
export abstract class CustomQuestion extends Command {
  constructor() {
    super();
  }

  /**
   * Get emoji
   * @param emojis
   * @param target
   * @returns GuildEmoji | undefined
   */
  getEmoji(emojis: BaseGuildEmojiManager, target: string): GuildEmoji | undefined {
    return emojis.cache.find((emoji) => emoji.name === target);
  }

  /**
   * Create message
   * @param message
   * @param bot
   * @returns MessageEmbed
   */
  private createRulesEmbed(message: string, bot: ClientUser | null): MessageEmbed {
    return new MessageEmbed()
      .setColor(2424832)
      .setAuthor({ name: this.c('customHeading'), iconURL: bot?.displayAvatarURL() })
      .setDescription(message);
  }

  /**
   * Create rules message to display
   * @param command
   */
  private async createRulesMessage(
    emojis: BaseGuildEmojiManager,
    bot: ClientUser | null
  ): Promise<QuestionMessage> {
    const e = this.getEmoji(emojis, environment.emojiAcceptRules.name);

    const rules = await rulesService.getServerRules(e);
    const rulesMessage = rules
      .map((r, i) => {
        return rules.length !== i ? (r.content += `\n\n`) : r;
      })
      .join('');
    const message = this.createRulesEmbed(rulesMessage, bot);

    return {
      message,
      emoji: [`${e?.name}:${e?.id}`]
    };
  }

  /**
   * Create game roles message
   * @param command
   */
  private async createGameRolesMessage(
    emojis: BaseGuildEmojiManager,
    roles: RoleManager | undefined,
    bot: ClientUser | null
  ): Promise<QuestionMessage> {
    const reactionRoles = await reactionService.getReactionRoles('game');
    const reactionNames: string[] = [];

    const guildEmojis = reactionRoles
      .map((r) => {
        const keys = Object.keys(r);
        reactionNames.push(keys[0]);
        return this.getEmoji(emojis, keys[0]);
      })
      .filter((g) => g?.name) as GuildEmoji[];

    const games = guildEmojis.map((ge) => {
      const { name, id } = ge;
      const role = reactionRoles.find((r) => r[name as string] !== undefined);
      if (!role?.[name as string] && !roles) {
        return '';
      }
      const r = Utility.findRole(roles, role?.[name as string]);
      const roleCopy = r?.mentionable ? '<@&' + r?.id + '>' : (r?.name as string);
      return this.c('roleAction', name as string, id, roleCopy);
    });

    const message = new MessageEmbed()
      .setAuthor({ name: this.c('questionAuthor'), iconURL: bot?.displayAvatarURL() })
      .setColor(3093237)
      .setDescription(this.c('questionDescription', games.toString()));

    return {
      message,
      emoji: guildEmojis.map((e) => `${e?.name}:${e?.id}`)
    };
  }

  /**
   * Custom question command
   * @param question
   * @param interaction
   */
  @Slash('custom-question', {
    description: 'Display a custom message like game roles and server rules!'
  })
  async init(
    @SlashChoice('Server Rules', QUESTION_TYPES[0])
    @SlashChoice('Game Roles', QUESTION_TYPES[1])
    @SlashOption('question', { description: 'Which question?' })
    question: string,
    interaction: CommandInteraction
  ): Promise<void> {
    const { client, guild } = interaction;
    let questionMessage: QuestionMessage = {
      message: undefined,
      emoji: []
    };

    if (question === QUESTION_TYPES[0]) {
      questionMessage = await this.createRulesMessage(client.emojis, client.user);
    }

    if (question === QUESTION_TYPES[1]) {
      questionMessage = await this.createGameRolesMessage(client.emojis, guild?.roles, client.user);
    }

    if (!questionMessage?.message || !questionMessage.emoji?.length) {
      await interaction.reply(this.c('customQuestionMessage'));
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return interaction.deleteReply();
    }

    const msg = (await interaction.reply({
      embeds: [questionMessage.message as MessageEmbed],
      fetchReply: true
    })) as Message;
    return questionMessage.emoji?.forEach((e) => msg.react(e));
  }
}
