import { reactionModelService } from 'Models/reaction-model.service';
import { Reaction, ReactionRoleTypes } from 'Types/reaction';
import { Guild } from 'discord.js';

interface ApiReactionRolesOption {
  type?: ReactionRoleTypes | 'action' | 'all-role';
}
export class ReactionService {
  /**
   * Fetch Reaction Roles
   * @returns Reaction[]
   */
  public async getReactionRoles(
    guild: Guild,
    options?: ApiReactionRolesOption
  ): Promise<Reaction[]> {
    const roles = await reactionModelService.getReactionRoles(guild);

    if (options?.type === 'action') {
      return roles.filter((r) => r.eventType === options?.type);
    }

    if (options?.type === 'all-role') {
      return roles.filter((r) => r.eventType !== 'action');
    }

    return roles.filter((r) => r.roleType === options?.type);
  }
}

export const reactionService = new ReactionService();
