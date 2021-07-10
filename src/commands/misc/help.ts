import {
  Client,
  Command,
  CommandInfos,
  CommandMessage,
  RuleBuilder,
} from '@typeit/discord';
import { environment } from 'Utils/environment';
import { commandOverrides, commandHelpTypes } from 'Data/help';
import Utility from 'Utils/utility';
import { EmbedFieldData, Message, MessageEmbed } from 'discord.js';
import { CommandItem, CommandType } from 'Types/help';

export class Help {
  /**
   * Create base message
   * @param command
   * @returns MessageEmbed
   */
  private createBaseMessage(
    command: CommandMessage,
    type?: CommandItem
  ): MessageEmbed {
    const t = type ? ` ${type.name}` : '';
    return new MessageEmbed()
      .setColor(10181046)
      .setAuthor(
        `${command?.client?.user?.username}${t} Plugin Commands`,
        command?.client?.user?.displayAvatarURL()
      )
      .setThumbnail(environment.botThumbnail);
  }

  /**
   * Create help status message
   */
  private async createHelpStatus(
    command: CommandMessage,
    allCommands: CommandInfos<any, RuleBuilder>[],
    type?: CommandItem
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

      if (command.deletable) await command.delete();
      return command.channel.send(message);
    } else {
      const message = this.createBaseMessage(command);
      let fields: EmbedFieldData[] = commandHelpTypes.map((c) => {
        const fullCommand = c.fullCommand.replace(
          '{botName}',
          command?.client?.user?.username || ''
        );

        return {
          name: c.name,
          value: `\`${fullCommand}\``,
        };
      });

      if (!Utility.isAdmin(command)) {
        fields = fields.filter(
          (c) => !commandHelpTypes.find((r) => r.name === c.name)?.restrict
        );
      }

      message.addFields([...fields]);
      if (command.deletable) await command.delete();
      return command.channel.send(message);
    }
  }

  /**
   * Fetch Commands
   * @param type
   */
  fetchCommands(type?: CommandItem): CommandInfos<any, RuleBuilder>[] {
    const commands = Client.getCommands();

    if (type) {
      const commandNames = commandOverrides
        .filter((c) => c.type === type.name.toLowerCase())
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
    const type = (
      Utility.getOptionFromCommand(command.content, 2, ' ') as CommandType
    ).toLowerCase();

    const commandGroup = commandHelpTypes.find(
      (c) => c.name.toLowerCase() === type
    );
    if (type && !commandGroup) {
      if (command.deletable) await command.delete();
      return command.channel
        .send(
          `**This command grouping does not exist! Please use just help to see valid groupings.**`
        )
        .then((m) => m.delete({ timeout: 5000 }));
    }

    if (!Utility.isAdmin(command) && commandGroup?.restrict) {
      if (command.deletable) await command.delete();
      return command.channel
        .send(`**You don't have the permissions for this**`)
        .then((m) => m.delete({ timeout: 5000 }));
    }

    const allCommands = this.fetchCommands(commandGroup);
    return this.createHelpStatus(command, allCommands, commandGroup).catch(
      () => {
        command.reply(environment.error);
      }
    );
  }
}
