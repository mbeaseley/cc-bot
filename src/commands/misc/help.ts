import {
  Client,
  Command,
  CommandInfos,
  CommandMessage,
  RuleBuilder,
} from '@typeit/discord';
import { environment } from '../../utils/environment';
import { commandOverrides, CommandType } from '../../data/help';
import Utility from '../../utils/utility';
import { Message, MessageEmbed } from 'discord.js';

export class Help {
  /**
   * Create base message
   * @param command
   * @returns MessageEmbed
   */
  private createBaseMessage(
    command: CommandMessage,
    type?: CommandType
  ): MessageEmbed {
    const t = type ? ` ${Utility.captaliseFirstLetter(type)}` : '';
    return new MessageEmbed()
      .setColor(10181046)
      .setAuthor(
        `${command?.client?.user?.username}${t} Plugin Commands`,
        command?.client?.user?.displayAvatarURL()
      )
      .setThumbnail('https://i.imgur.com/6CKmCtO.png');
  }

  /**
   * Init
   */
  private async createHelpStatus(
    command: CommandMessage,
    allCommands: CommandInfos<any, RuleBuilder>[],
    type?: CommandType
  ): Promise<Message | void> {
    if (type) {
      const fields = allCommands.map((c) => {
        const item = commandOverrides.find((cd) => cd.name === c.commandName);
        c.commandName = item ? item.fullCommand : c.commandName;
        return {
          name: `**${c.description}**`,
          value: `\`@${environment.botName} ${c.commandName}\``,
        };
      });

      const message = this.createBaseMessage(command, type);
      message.addFields([...fields]);

      await command.delete();
      return command.channel.send(message);
    } else {
      const message = this.createBaseMessage(command);
      message.addFields([
        {
          name: `Fun`,
          value: `\`@${command?.client?.user?.username} help fun\``,
        },
        {
          name: `Games`,
          value: `\`@${command?.client?.user?.username} help games\``,
        },
        {
          name: `Searchers`,
          value: `\`@${command?.client?.user?.username} help searchers\``,
        },
      ]);

      if (Utility.isAdmin(command)) {
        message.addField(
          'Admin',
          `\`@${command?.client?.user?.username} help admin\``
        );
      }
      await command.delete();
      return command.channel.send(message);
    }
  }

  fetchCommands(type?: CommandType): CommandInfos<any, RuleBuilder>[] {
    const commands = Client.getCommands();

    if (type) {
      const commandNames = commandOverrides
        .filter((c) => c.type === type)
        .map((c) => c.name);
      return commands.filter(
        (c) => commandNames.indexOf(c.commandName as string) > -1
      );
    }

    return commands.filter((c) => c.commandName !== 'help');
  }

  /**
   * @name helpInit
   * @param command
   * @description Display possible commands
   * @returns
   */
  @Command('help')
  async helpInit(command: CommandMessage): Promise<Message | void> {
    const type = Utility.getOptionFromCommand(
      command.content,
      2,
      ' '
    ) as CommandType;

    if (!Utility.isAdmin(command)) {
      await command.delete();
      return command.channel
        .send(`**You don't have the permissions for this**`)
        .then((m) => m.delete({ timeout: 5000 }));
    }

    const allCommands = this.fetchCommands(type);
    return this.createHelpStatus(command, allCommands, type).catch(() => {
      command.reply(environment.error);
    });
  }
}
