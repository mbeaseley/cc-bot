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
  public async getReactionRoles(): Promise<Reaction[]> {
    return this.reactionModelService.getReactionRoles();
  }

  /**
   * Fetch Reaction Actions
   * @returns Reaction[]
   */
  public async getReactionActions(): Promise<Reaction[]> {
    return this.reactionModelService.getReactionActions();
  }
}
