import { rulesModelService } from 'Models/rules-model.service';
import { RuleItem } from 'Types/question';
import { GuildEmoji } from 'discord.js';

export class RulesService {
  /**
   * Fetch Server Rules
   * @returns RuleItem[]
   */
  public async getServerRules(acceptEmoji: GuildEmoji | undefined): Promise<RuleItem[]> {
    return rulesModelService.getServerRules(acceptEmoji);
  }
}

export const rulesService = new RulesService();
