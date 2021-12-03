import { ReactionModelService } from 'Models/reaction-model.service';
import { Reaction } from 'Types/reaction';

export class ReactionService {
  private reactionModelService: ReactionModelService;

  constructor() {
    this.reactionModelService = new ReactionModelService();
  }

  /**
   * Fetch Reaction Roles
   * @returns Reaction[]
   */
  public async getReactionRoles(type?: 'user' | 'social' | 'game'): Promise<Reaction[]> {
    const roles = await this.reactionModelService.getReactionRoles();
    return type ? roles.filter((r) => r.type === type) : roles;
  }

  /**
   * Fetch Reaction Actions
   * @returns Reaction[]
   */
  public async getReactionActions(): Promise<Reaction[]> {
    return this.reactionModelService.getReactionActions();
  }
}
