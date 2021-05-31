import { GuildEmoji } from 'discord.js';
import { DatabaseService } from '../services/database.service';
import { RulesCollection } from '../types/database';
import { RuleItem, RuleType } from '../types/question';
import Utility from '../utils/utility';

export class RulesModelService {
  private databaseService: DatabaseService;
  private _serverRules: RuleItem[] | undefined;

  constructor() {
    this.databaseService = new DatabaseService();
  }

  private get serverRules() {
    return this._serverRules ?? [];
  }

  private set serverRules(value: RuleItem[]) {
    this._serverRules = value;
  }

  private fromServerPayload(
    res: { content: string; type: string }[],
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
      if (
        acceptEmoji?.name &&
        Utility.checkStatementForStrings(emojiCopyKeys, rule.content)
      ) {
        emojikeys.forEach((k) => {
          rule.content = rule.content.replace(
            `emoji_${k}`,
            acceptEmoji[k as keyof typeof acceptEmoji] as string
          );
          console.log(rule.content, `emoji_${k}`);
        });
      }

      return rule;
    });
  }

  public async getServerRules(
    acceptEmoji: GuildEmoji | undefined
  ): Promise<RuleItem[]> {
    if (this.serverRules.length) {
      return Promise.resolve(this.serverRules);
    }

    const res = await this.databaseService.connect(
      'rules',
      RulesCollection.server
    );
    this.serverRules = this.fromServerPayload(res, acceptEmoji);
    return this.serverRules;
  }
}
