import { Client } from '@typeit/discord';
import * as chalk from 'chalk';
import {
  GuildMember,
  Message,
  MessageReaction,
  PartialUser,
  Role,
  User,
} from 'discord.js';
import { ReactionService } from 'Services/reaction.service';
import { Logger } from 'Services/logger.service';
import { environment } from 'Utils/environment';
import Utility from 'Utils/utility';
import { Reaction } from 'Types/reaction';

export class ReactionRoles {
  private reactionService: ReactionService;
  logger: Logger;

  constructor() {
    this.reactionService = new ReactionService();
    this.logger = new Logger();
  }

  /**
   * Get choosen role or action
   * @param reactions
   * @param emojiName
   * @returns string
   */
  private getChoosenRoleOrAction(
    reactions: Reaction[],
    emojiName: string
  ): string {
    let choosenReaction = '';
    reactions.forEach((r) => {
      if (r[emojiName]) {
        choosenReaction = r[emojiName];
      }
    });

    return choosenReaction;
  }

  /**
   * Add/remove user roles
   * @param action
   * @param reaction
   * @param member
   * @param role
   * @returns void
   */
  private async addOrRemoveRole(
    action: 'add' | 'remove',
    reaction: MessageReaction,
    member: GuildMember,
    role: Role | undefined
  ): Promise<void> {
    if (!role?.id) {
      this.logger.error(
        `${chalk.bold('BOT ERROR')}: Role not found for '${
          reaction.emoji.name
        }'`
      );
      return Promise.reject();
    }

    try {
      await member.roles[action](role.id);
    } catch (e: unknown) {
      this.logger.error(`${chalk.bold('BOT ERROR')}: 'Error adding role' ${e}`);
      return Promise.reject();
    }
  }

  /**
   * Handle additional actions
   * @param reaction
   * @param action
   * @returns void
   */
  private async handleAction(
    reaction: MessageReaction,
    action: string
  ): Promise<void | Message> {
    try {
      if (action === 'delete') {
        return reaction.message.delete();
      }

      this.logger.error(
        `${chalk.bold('BOT ERROR')}: Action not found for '${
          reaction.emoji.name
        }'`
      );
    } catch (e: unknown) {
      this.logger.error(
        `${chalk.bold('BOT ERROR')}: 'Error doing action' ${e}`
      );
      return Promise.reject();
    }
  }

  /**
   * Base of adding guild roles through emoji
   * @param action
   * @param reaction
   * @param user
   * @returns void
   */
  private async handleReactionAction(
    action: 'add' | 'remove',
    reaction: MessageReaction,
    user: User | PartialUser
  ): Promise<void | Message> {
    if (user.bot) {
      return Promise.reject();
    }

    if (reaction.partial) {
      try {
        await reaction.fetch();
      } catch (e: unknown) {
        return Promise.reject(e);
      }
    }

    const guild = Utility.getGuild(reaction.client.guilds);

    if (!guild?.id) {
      return Promise.reject();
    }

    const reactionRoles = await this.reactionService.getReactionRoles();
    const member = await guild.members.fetch(user.id);
    const choosenRole = this.getChoosenRoleOrAction(
      reactionRoles,
      reaction.emoji.name
    );
    const role = guild.roles.cache.find((r) => r.name === choosenRole);

    if (role && reaction.message.author.bot) {
      return this.addOrRemoveRole(action, reaction, member, role);
    }

    const u = environment.admins.find((a) => a === user.id);
    const reactionActions = await this.reactionService.getReactionActions();
    const choosenAction = this.getChoosenRoleOrAction(
      reactionActions,
      reaction.emoji.name
    );
    if (choosenAction && action === 'add' && u) {
      return this.handleAction(reaction, choosenAction);
    }

    return Promise.resolve();
  }

  /**
   * Init for reaction add and removal
   * @param client
   */
  public init(client: Client): void {
    client.on('messageReactionAdd', (reaction, user) =>
      this.handleReactionAction('add', reaction, user).catch(() => {})
    );
    client.on('messageReactionRemove', (reaction, user) =>
      this.handleReactionAction('remove', reaction, user).catch(() => {})
    );
  }
}
