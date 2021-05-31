import { Command, CommandMessage, Description, Guard } from '@typeit/discord';
import { isAdmin } from '../guards/isAdmin';
import { environment } from '../utils/environment';
import { RulesService } from '../services/rules.service';

const QUESTION_TYPES = ['rules'];

export class ReactionQuestions {
  private rulesService: RulesService;

  constructor() {
    this.rulesService = new RulesService();
  }

  private async handleQuestion(command: CommandMessage): Promise<void> {
    const commandArray = command.content.split(' ');
    const keyCommand = commandArray[commandArray.length - 1].toLowerCase();

    if (keyCommand === QUESTION_TYPES[0]) {
      command.delete();

      const e = command.client.emojis.cache.find(
        (e) => e.name === environment.emojiAcceptRules.name
      );

      const rules = await this.rulesService.getServerRules(e);
      const rulesMessage = rules.map((r, i) => {
        return rules.length !== i ? (r.content += `\n`) : r;
      });

      return command.channel.send(rulesMessage).then((message) => {
        message.react(`${e?.name}:${e?.id}`);
      });
    }

    return Promise.resolve();
  }

  @Command('question')
  @Description('Custom questions')
  @Guard(isAdmin)
  init(command: CommandMessage): Promise<void> {
    return this.handleQuestion(command).catch(() => {
      command.reply(environment.error);
    });
  }
}
