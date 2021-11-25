import {
  BaseGuildEmojiManager,
  ClientUser,
  CommandInteraction,
  GuildEmoji,
  Message,
  MessageEmbed,
  RoleManager,
} from 'discord.js';
import { Discord, Permission, Slash, SlashChoice, SlashOption } from 'discordx';
import { ReactionService } from '../../services/reaction.service';
import { RulesService } from '../../services/rules.service';
import { QuestionMessage } from '../../types/question';
import { environment } from '../../utils/environment';
import Translate from '../../utils/translate';
import Utility from '../../utils/utility';

const QUESTION_TYPES = ['rules', 'game roles'];

@Discord()
@Permission(false)
@Permission({
  id: environment.moderatorRoles[0],
  type: 'ROLE',
  permission: true,
})
export abstract class CustomQuestion {
  private rulesService: RulesService;
  private reactionService: ReactionService;

  constructor() {
    this.rulesService = new RulesService();
    this.reactionService = new ReactionService();
  }

  getEmoji(
    emojis: BaseGuildEmojiManager,
    target: string
  ): GuildEmoji | undefined {
    return emojis.cache.find((emoji) => emoji.name === target);
  }

  /**
   * Create message
   * @param message
   * @param bot
   * @returns MessageEmbed
   */
  private createRulesEmbed(
    message: string,
    bot: ClientUser | null
  ): MessageEmbed {
    return new MessageEmbed()
      .setColor(2424832)
      .setAuthor(`Discord Server Rules`, bot?.displayAvatarURL())
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

    const rules = await this.rulesService.getServerRules(e);
    const rulesMessage = rules
      .map((r, i) => {
        return rules.length !== i ? (r.content += `\n\n`) : r;
      })
      .join('');
    const message = this.createRulesEmbed(rulesMessage, bot);

    return {
      message,
      emoji: [`${e?.name}:${e?.id}`],
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
    const reactionRoles = await this.reactionService.getReactionRoles('game');
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
      const roleCopy = r?.mentionable
        ? '<@&' + r?.id + '>'
        : (r?.name as string);
      return Translate.find('roleAction', name as string, id, roleCopy);
    });

    const message = new MessageEmbed()
      .setAuthor(Translate.find('questionAuthor'), bot?.displayAvatarURL())
      .setColor(3093237)
      .setDescription(Translate.find('questionDescription', games.toString()));

    return {
      message,
      emoji: guildEmojis.map((e) => `${e?.name}:${e?.id}`),
    };
  }

  /**
   * Custom question command
   * @param question
   * @param interaction
   */
  @Slash('custom-question', {
    description: 'Display a custom message like game roles and server rules',
  })
  async init(
    @SlashChoice('Server Rules', QUESTION_TYPES[0])
    @SlashChoice('Game Roles', QUESTION_TYPES[1])
    @SlashOption('question', { description: 'Which question?', required: true })
    question: string,
    interaction: CommandInteraction
  ): Promise<void> {
    const { client, guild } = interaction;
    let questionMessage: QuestionMessage = {
      message: undefined,
      emoji: [],
    };

    if (question === QUESTION_TYPES[0]) {
      questionMessage = await this.createRulesMessage(
        client.emojis,
        client.user
      );
    }

    if (question === QUESTION_TYPES[1]) {
      questionMessage = await this.createGameRolesMessage(
        client.emojis,
        guild?.roles,
        client.user
      );
    }

    if (!questionMessage?.message || !questionMessage.emoji?.length) {
      await interaction.reply(
        `**Sorry, there was an issue with create message or finding emojis!**`
      );
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return interaction.deleteReply();
    }

    const msg = (await interaction.reply({
      embeds: [questionMessage.message as MessageEmbed],
      fetchReply: true,
    })) as Message;
    return questionMessage.emoji?.forEach((e) => msg.react(e));
  }
}
