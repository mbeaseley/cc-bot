import { RulesModelService } from '../models/rules-model.service';
import { RuleItem } from '../types/question';
import { GuildEmoji } from 'discord.js';

export class RulesService {
  private rulesModelService: RulesModelService;

  constructor() {
    this.rulesModelService = new RulesModelService();
  }

  /**
   * Fetch Server Rules
   * @returns RuleItem[]
   */
  public async getServerRules(
    acceptEmoji: GuildEmoji | undefined
  ): Promise<RuleItem[]> {
    return this.rulesModelService.getServerRules(acceptEmoji);
  }
}
