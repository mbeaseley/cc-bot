import { GuildEmoji } from 'discord.js';
import { RuleItem } from '../types/question';
import { RulesModelService } from '../models/rules-model.service';

export class RulesService {
  private rulesModelService: RulesModelService;

  constructor() {
    this.rulesModelService = new RulesModelService();
  }

  public async getServerRules(
    acceptEmoji: GuildEmoji | undefined
  ): Promise<RuleItem[]> {
    return this.rulesModelService.getServerRules(acceptEmoji);
  }
}
