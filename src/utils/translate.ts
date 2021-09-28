import { admin } from 'Language/admin';
import { error } from 'Language/error';
import { fun } from 'Language/fun';
import { games } from 'Language/games';
import { image } from 'Language/image';
import { misc } from 'Language/misc';
import { music } from 'Language/music';
import { searchers } from 'Language/searchers';

export default class Translate {
  /**
   * Find correct translate copy
   * @param key
   * @param args
   * @returns string
   */
  static find(key: string, args?: string[]): string {
    const allCopys = {
      ...admin,
      ...error,
      ...fun,
      ...games,
      ...image,
      ...misc,
      ...music,
      ...searchers,
    };
    const selectedKey = Object.keys(allCopys).find((k) => k === key);

    if (!selectedKey) {
      return '';
    }

    let selectedCopy = allCopys[selectedKey];
    args?.map((a: string, i: number) => {
      selectedCopy = selectedCopy.replace(`{${i}}`, a);
    });

    return selectedCopy;
  }
}
