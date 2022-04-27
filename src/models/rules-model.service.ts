import { databaseService } from 'Services/database.service';
import { ApiServerRules } from 'Types/api/rules';
import { RulesCollection } from 'Types/database';
import { RuleItem, RuleType } from 'Types/question';
import Utility from 'Utils/utility';
import { GuildEmoji } from 'discord.js';

export class RulesModelService {
  private _serverRules: RuleItem[] | undefined;

  /**
   * ==================================
   * Fetch Server Rules
   * ==================================
   */

  /**
   * Get Server Rules
   */
  private get serverRules() {
    return this._serverRules ?? [];
  }

  /**
   * Set Server Rules
   */
  private set serverRules(value: RuleItem[]) {
    this._serverRules = value;
  }

  /**
   * Format rule items into type
   * @param res
   * @param acceptEmoji
   * @returns RuleItem[]
   */
  private fromServerPayload(
    res: ApiServerRules[],
    acceptEmoji: GuildEmoji | undefined
  ): RuleItem[] {
    let ruleCount = 1;
    return res.map((r) => {
      const rule = new RuleItem(
        r.content,
        r.type === RuleType.rule ? RuleType.rule : RuleType.copy
      );

      if (rule.type === RuleType.rule) {
        rule.content = `${ruleCount}) ` + rule.content;
        ruleCount++;
      }

      const emojikeys = ['name', 'id'];
      const emojiCopyKeys = ['emoji_name', 'emoji_id'];
      if (acceptEmoji?.name && Utility.checkStatementForStrings(emojiCopyKeys, rule.content)) {
        emojikeys.forEach((k) => {
          rule.content = rule.content.replace(
            `emoji_${k}`,
            acceptEmoji[k as keyof typeof acceptEmoji] as string
          );
        });
      }

      return rule;
    });
  }

  /**
   * Fetch Server rules from database
   * @param acceptEmoji
   * @returns RuleItem[]
   */
  public async getServerRules(acceptEmoji: GuildEmoji | undefined): Promise<RuleItem[]> {
    if (this.serverRules.length) {
      return Promise.resolve(this.serverRules);
    }

    const res = await databaseService.get<any, ApiServerRules>('rules', RulesCollection.server);
    this.serverRules = this.fromServerPayload(res, acceptEmoji);
    return this.serverRules;
  }
}

export const rulesModelService = new RulesModelService();
