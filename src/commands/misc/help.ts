import {
  Client,
  Command,
  CommandInfos,
  CommandMessage,
  RuleBuilder,
} from '@typeit/discord';
import { environment } from '../../utils/environment';
import { commandOverrides, adminCommands } from '../../data/help';

export class Help {
  /**
   * Init
   */
  private async createHelpStatus(
    command: CommandMessage,
    allCommands: CommandInfos<any, RuleBuilder>[]
  ): Promise<void> {
    const fields = allCommands
      .filter((c) => !adminCommands.find((name) => name === c.commandName))
      .map((c) => {
        const item = commandOverrides.find((cd) => cd.name === c.commandName);
        c.commandName = item ? item.fullCommand : c.commandName;

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
    console.log(allCommands);
    command.delete();
    return this.createHelpStatus(command, allCommands).catch(() => {
      command.reply(environment.error);
    });
  }
}
