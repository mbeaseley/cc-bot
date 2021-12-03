import { MessageEmbed } from 'discord.js';

export class RuleItem {
  content: string;
  type: RuleType;

  constructor(content?: string, type?: RuleType) {
    this.content = content ?? '';
    this.type = type ?? RuleType.copy;
  }
}

export enum RuleType {
  rule = 'rule',
  copy = 'copy'
}

export interface QuestionMessage {
  message: MessageEmbed | undefined;
  emoji: string[] | undefined;
}
