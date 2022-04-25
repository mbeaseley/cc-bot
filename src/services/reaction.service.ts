import { reactionModelService } from 'Models/reaction-model.service';
import { Reaction } from 'Types/reaction';

export class ReactionService {
  /**
   * Fetch Reaction Roles
   * @returns Reaction[]
   */
  public async getReactionRoles(type?: 'user' | 'social' | 'game'): Promise<Reaction[]> {
    const roles = await reactionModelService.getReactionRoles();
    return type ? roles.filter((r) => r.type === type) : roles;
  }

  /**
   * Fetch Reaction Actions
   * @returns Reaction[]
   */
  public async getReactionActions(): Promise<Reaction[]> {
    return reactionModelService.getReactionActions();
  }
}

export const reactionService = new ReactionService();
