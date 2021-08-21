import { Client } from '@typeit/discord';
import { BeamUp } from 'Commands/misc/beam-up';
import { Logger } from 'Services/logger.service';
import { ReactionService } from 'Services/reaction.service';
import { Reaction, ReactionActions } from 'Types/reaction';
import { environment } from 'Utils/environment';
import Utility from 'Utils/utility';
import chalk from 'chalk';
import {
  GuildMember,
  Message,
  MessageReaction,
  PartialUser,
  Role,
  User,
} from 'discord.js';

export class ReactionRoles {
  private reactionService: ReactionService;
  private logger: Logger;
  private beamUp: BeamUp;

  constructor() {
    this.reactionService = new ReactionService();
    this.logger = new Logger();
    this.beamUp = new BeamUp();
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
    action: ReactionActions
  ): Promise<void | Message | GuildMember> {
    try {
      if (action === 'delete') {
        return reaction.message.delete();
      }

      if (action === 'beam_up' && BeamUp.voiceChannel?.id) {
        return this.beamUp.moveMemberToChannel();
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
  ): Promise<void | Message | GuildMember> {
    if (user.bot) {
      return Promise.resolve();
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
      return Promise.resolve();
    }

    const reactionRoles = await this.reactionService.getReactionRoles();
    const member = await guild.members.fetch(user.id);
    const choosenRole = this.getChoosenRoleOrAction(
      reactionRoles,
      reaction.emoji.name
    );

    if (
      action === 'remove' &&
      reaction.emoji.name === environment.emojiAcceptRules.name
    ) {
      return Promise.resolve();
    }

    const role = guild.roles.cache.find((r) => r.name === choosenRole);

    if (role && reaction.message.author.bot) {
      return this.addOrRemoveRole(action, reaction, member, role);
    }

    const u = environment.admins.find((a) => a === user.id);
    const reactionActions = await this.reactionService.getReactionActions();
    const choosenAction = this.getChoosenRoleOrAction(
      reactionActions,
      reaction.emoji.name
    ) as ReactionActions;
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
      this.handleReactionAction('add', reaction, user).catch((e: unknown) => {
        this.logger.error(
          `${chalk.bold('BOT ERROR')}: 'Error adding role' ${
            (e as Error).message
          }`
        );
      })
    );

    client.on('messageReactionRemove', (reaction, user) =>
      this.handleReactionAction('remove', reaction, user).catch(
        (e: unknown) => {
          this.logger.error(
            `${chalk.bold('BOT ERROR')}: 'Error removing role' ${
              (e as Error).message
            }`
          );
        }
      )
    );
  }
}
