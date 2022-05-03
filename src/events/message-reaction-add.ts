import { hasPermission } from 'Guards/has-permission';
import { reactionService } from 'Services/reaction.service';
import { Reaction, ReactionActions } from 'Types/reaction';
import { environment } from 'Utils/environment';
import Utility from 'Utils/utility';
import { GuildMember, Message, PartialMessage, Role } from 'discord.js';
import { ArgsOf, Discord, On } from 'discordx';

@Discord()
export abstract class messageReactionAdd {
  /**
   * Get choosen role or action
   * @param reactions
   * @param emojiName
   * @returns string
   */
  private getChoosenRoleOrAction(reactions: Reaction[], emojiName: string): string {
    let choosenReaction = '';
    reactions.forEach((r) => {
      if (r[emojiName]) {
        choosenReaction = r[emojiName];
      }
    });

    return choosenReaction;
  }

  /**
   * Add user roles
   * @param action
   * @param reaction
   * @param member
   * @param role
   * @returns void
   */
  private async addRole(member: GuildMember, role: Role | undefined): Promise<void> {
    if (!role?.id) {
      return Promise.reject();
    }

    try {
      await member.roles.add(role.id);
    } catch (e: unknown) {
      return Promise.resolve();
    }
  }

  /**
   * Handle additional actions
   * @param reaction
   * @param action
   * @returns void
   */
  private async handleAction(
    message: Message<boolean> | PartialMessage,
    action: ReactionActions
  ): Promise<void | Message | GuildMember> {
    try {
      if (action === 'delete') {
        return message.delete();
      }
    } catch (e: unknown) {
      return Promise.resolve();
    }
  }

  /**
   * messageReactionAdd event
   * @param messageReaction
   * @param user
   * @returns
   */
  @On('messageReactionAdd')
  async init([messageReaction, user]: ArgsOf<'messageReactionAdd'>): Promise<any> {
    if (user.bot) {
      return Promise.resolve();
    }

    if (messageReaction.partial) {
      try {
        await messageReaction.fetch();
      } catch (e) {
        return Promise.resolve();
      }
    }

    const guild = Utility.getGuild(messageReaction.client.guilds);

    if (!guild?.id) {
      return Promise.resolve();
    }

    const reactionRoles = await reactionService.getReactionRoles(guild, { type: 'all-role' });
    const member = await guild.members.fetch(user.id);
    const choosenRole = this.getChoosenRoleOrAction(
      reactionRoles,
      messageReaction.emoji?.name ?? ''
    );

    const role = guild.roles.cache.find((r) => r.name === choosenRole);

    if (role && messageReaction?.message?.author?.bot) {
      return this.addRole(member, role);
    }

    const { moderatorRoles, ownerId } = environment;
    const mods = hasPermission(moderatorRoles)?.map((m) => m.id);

    const isMod = member.roles.cache.find((r) => mods.indexOf(r.id) > -1) || member.id === ownerId;

    const reactionActions = await reactionService.getReactionRoles(guild, { type: 'action' });

    const choosenAction = this.getChoosenRoleOrAction(
      reactionActions,
      messageReaction.emoji?.name ?? ''
    ) as ReactionActions;

    if (choosenAction && isMod) {
      return this.handleAction(messageReaction.message, choosenAction);
    }

    return Promise.resolve();
  }
}
