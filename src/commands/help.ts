import {
  Client,
  Command,
  CommandInfos,
  CommandMessage,
  RuleBuilder,
} from '@typeit/discord';
import { environment } from '../utils/environment';

const EXCLUDE_COMMANDS = ['help', 'purge'];
export class Help {
  /**
   * Init
   */
  private async createHelpStatus(
    command: CommandMessage,
    allCommands: CommandInfos<any, RuleBuilder>[]
  ): Promise<void> {
    const fields = allCommands
      .filter((c) => !EXCLUDE_COMMANDS.find((name) => name === c.commandName))
      .map((c) => {
        if (c.commandName === 'playerchoice') {
          c.commandName =
            'playerchoice @user(optional)\nExclude users example: @user @user (add after command name)';
        }

        if (c.commandName === 'insult') {
          c.commandName = 'insult @user(optional)';
        }

        if (c.commandName === 'compliment') {
          c.commandName = 'compliment @user(optional)';
        }

        if (c.commandName === 'sayIt') {
          c.commandName = 'sayIt @user(optional)';
        }

        return {
          name: `**${c.description}**`,
          value: `\`@${environment.botName} ${c.commandName}\``,
        };
      });

    command.channel.send({
      embed: {
        color: 10181046,
        author: {
          name: `${command?.client?.user?.username} Plugin Commands`,
          icon_url: command?.client?.user?.displayAvatarURL(),
        },
        fields,
      },
    });
    return Promise.resolve();
  }

  /**
   * @name helpInit
   * @param command
   * @description Display possible commands
   * @returns
   */
  @Command('help')
  helpInit(command: CommandMessage): Promise<void> {
    const allCommands = Client.getCommands();

    return this.createHelpStatus(command, allCommands).catch(() => {
      command.reply(environment.error);
    });
  }
}
