import { MessageReaction, PartialUser, User } from 'discord.js';
import { reactionRoles } from '../data/roles';
import Utility from '../utils/utility';

export class ReactionRoles {
  /**
   * Base of adding guild roles through emoji
   * @param action
   * @param reaction
   * @param user
   * @returns void
   */
  async reactionRolesInit(
    action: 'add' | 'remove',
    reaction: MessageReaction,
    user: User | PartialUser
  ): Promise<void> {
    if (user.bot) {
      return Promise.reject();
    }

    if (reaction.partial) {
      try {
        await reaction.fetch();
      } catch (e) {
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

    if (!role?.id) {
      console.error(`Role not found for '${reaction.emoji.name}'`);
      return Promise.reject();
    }

    try {
      (await member).roles[action](role.id);
    } catch (e) {
      console.error('Error adding role', e);
      return Promise.reject();
    }

    return Promise.resolve();
  }
}
