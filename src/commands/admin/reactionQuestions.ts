import { Command, CommandMessage, Description, Guard } from '@typeit/discord';
import { isAdmin } from 'Guards/isAdmin';
import { ReactionService } from 'Root/services/reaction.service';
import { Logger } from 'Services/logger.service';
import { RulesService } from 'Services/rules.service';
import { environment } from 'Utils/environment';
import Translate from 'Utils/translate';
import Utility from 'Utils/utility';
import { GuildEmoji, Message, MessageEmbed } from 'discord.js';

const QUESTION_TYPES = ['rules', 'game roles'];

export class ReactionQuestions {
  private rulesService: RulesService;
  private reactionService: ReactionService;
  private logger: Logger;

  constructor() {
    this.rulesService = new RulesService();
    this.reactionService = new ReactionService();
    this.logger = new Logger();
  }

  /**
   * Create rules message to display
   * @param command
   */
  private async createRulesMessage(command: CommandMessage): Promise<void> {
    const e = Utility.findEmoji(
      command.client.emojis,
      environment.emojiAcceptRules.name
    );

    const rules = await this.rulesService.getServerRules(e);
    const rulesMessage = rules.map((r, i) => {
      return rules.length !== i ? (r.content += `\n`) : r;
    });

    return command.channel.send(rulesMessage).then((message) => {
      message.react(`${e?.name}:${e?.id}`);
    });
  }

  /**
   * Create game roles message
   * @param command
   */
  private async createGameRolesMessage(command: CommandMessage): Promise<any> {
    const reactionRoles = await this.reactionService.getReactionRoles('game');
    const reactionNames: string[] = [];

    const guildEmojis = reactionRoles
      .map((r) => {
        const keys = Object.keys(r);
        reactionNames.push(keys[0]);
        return Utility.findEmoji(command.client.emojis, keys[0]);
      })
      .filter((g) => g?.name) as GuildEmoji[];

    const games = guildEmojis.map((ge) => {
      const role = reactionRoles.find((r) => r[ge.name] !== undefined);
      if (!role?.[ge.name] && !command?.guild?.roles) {
        return '';
      }
      const r = Utility.findRole(command?.guild?.roles, role?.[ge.name]);
      const roleCopy = r?.mentionable
        ? '<@&' + r?.id + '>'
        : (r?.name as string);
      return Translate.find('roleAction', ge.name, ge.id, roleCopy);
    });

    const message = new MessageEmbed()
      .setAuthor(
        Translate.find('questionAuthor'),
        command.client.user?.displayAvatarURL()
      )
      .setColor(3093237)
      .setDescription(Translate.find('questionDescription', games.toString()));

    return command.channel
      .send(message)
      .then((msg) =>
        guildEmojis.forEach((e) => msg.react(`${e?.name}:${e?.id}`))
      );
  }

  /**
   * Question init
   * @param command
   */
  @Command('question')
  @Description('Custom questions')
  @Guard(isAdmin)
  async init(command: CommandMessage): Promise<Message | void> {
    try {
      const commandArray = Utility.getOptionFromCommand(
        command.content,
        2,
        ' '
      );
      const keyCommand = (commandArray as string).toLowerCase();

      if (command.deletable) await command.delete();

      if (keyCommand === QUESTION_TYPES[0]) {
        return this.createRulesMessage(command);
      }

      if (keyCommand === QUESTION_TYPES[1]) {
        return this.createGameRolesMessage(command);
      }

      this.logger.error(
        Translate.find('errorLog', 'question', 'incorrect type choosen')
      );
      return Utility.sendMessage(
        command,
        Translate.find('questionFormatError'),
        'channel',
        5000
      );
    } catch (e: unknown) {
      if (command.deletable) await command.delete();
      this.logger.error(
        Translate.find('errorLog', 'question', (e as Error).message)
      );
      return Utility.sendMessage(
        command,
        Translate.find('errorDefault', (e as Error).message),
        'channel',
        5000
      );
    }
  }
}
