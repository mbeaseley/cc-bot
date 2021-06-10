export class PollQuestion {
  question: string;
  answers: string[];

  constructor(question: string, answers: string[]) {
    this.question = question;
    this.answers = answers;
  }
}

export enum selectionEmojis {
  a = '🇦',
  b = '🇧',
  c = '🇨',
  d = '🇩',
  e = '🇪',
  f = '🇫',
  g = '🇬',
  h = '🇭',
  i = '🇮',
  j = '🇯',
  k = '🇰',
  l = '🇱',
  m = '🇲',
  n = '🇳',
  o = '🇴',
  p = '🇵',
  q = '🇶',
  r = '🇷',
  s = '🇸',
  t = '🇹',
  u = '🇺',
  v = '🇻',
  w = '🇼',
  x = '🇽',
  y = '🇾',
  z = '🇿',
}
