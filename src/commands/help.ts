import { CommandInfos, CommandMessage, RuleBuilder } from '@typeit/discord';

export class Help {
  /**
   * Init
   */
  public async init(
    command: CommandMessage,
    allCommands: CommandInfos<any, RuleBuilder>[]
  ): Promise<void> {
    const fields = allCommands
      .filter((c) => c.commandName !== 'help')
      .map((c) => {
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
          value: `\`@CC Bot ${c.commandName}\``,
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
}
