import * as chalk from 'chalk';
import {
  GuildMember,
  Message,
  MessageReaction,
  PartialUser,
  Role,
  User,
} from 'discord.js';
import { reactionActions, reactionRoles } from '../data/roles';
import { Logger } from '../services/logger.service';
import { environment } from '../utils/environment';
import Utility from '../utils/utility';

export class ReactionRoles {
  logger: Logger;

  constructor() {
    this.logger = new Logger();
  }

  /**
   * Add/remove user roles
   * @param action
   * @param reaction
   * @param member
   * @param role
   * @returns void
   */
  async addOrRemoveRole(
    action: 'add' | 'remove',
    reaction: MessageReaction,
    member: Promise<GuildMember>,
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
      (await member).roles[action](role.id);
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
  async handleAction(
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
  async init(
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

    const member = guild.members.fetch(user.id);
    const role = guild.roles.cache.find(
      (r) => r.name === reactionRoles[reaction.emoji.name]
    );

    if (role && reaction.message.author.bot) {
      return this.addOrRemoveRole(action, reaction, member, role);
    }

    const u = environment.admins.find((a) => a === user.id);
    if (reactionActions[reaction.emoji.name] && action === 'add' && u) {
      return this.handleAction(reaction, reactionActions[reaction.emoji.name]);
    }

    return Promise.resolve();
  }
}
