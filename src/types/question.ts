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
  copy = 'copy',
}
