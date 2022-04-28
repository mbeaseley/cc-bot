import { rulesModelService } from 'Models/rules-model.service';
import { RuleItem } from 'Types/question';
import { Guild, GuildEmoji } from 'discord.js';

export class RulesService {
  /**
   * Fetch Server Rules
   * @returns RuleItem[]
   */
  public async getServerRules(
    guild: Guild,
    acceptEmoji: GuildEmoji | undefined
  ): Promise<RuleItem[]> {
    return rulesModelService.getServerRules(guild, acceptEmoji);
  }
}

export const rulesService = new RulesService();
