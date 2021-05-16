import { Command, CommandMessage, Description, Guard } from '@typeit/discord';
import { isAdmin } from '../guards/isAdmin';
import { environment } from '../utils/environment';
import { rules } from '../data/rules';

const QUESTION_TYPES = ['rules'];

export class ReactionQuestions {
  handleQuestion(command: CommandMessage): Promise<void> {
    const commandArray = command.content.split(' ');
    const keyCommand = commandArray[commandArray.length - 1].toLowerCase();

    if (keyCommand === QUESTION_TYPES[0]) {
      command.delete();

      const e = command.client.emojis.cache.find(
        (e) => e.name === environment.emojiAcceptRules.name
      );

      const rulesMessage = rules(e).map((r, i) => {
        return rules(e)?.length !== i ? (r += `\n`) : r;
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
