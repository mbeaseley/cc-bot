import { admin } from '../assets/language/admin';
import { error } from '../assets/language/error';
import { fun } from '../assets/language/fun';
import { games } from '../assets/language/games';
import { image } from '../assets/language/image';
import { misc } from '../assets/language/misc';
import { moderation } from '../assets/language/moderation';
import { music } from '../assets/language/music';
import { searchers } from '../assets/language/searchers';

export default class Translate {
  /**
   * Find correct translate copy
   * @param key
   * @param args
   * @returns string
   */
  static find(key: string, ...args: string[]): string {
    const allCopys = {
      ...admin,
      ...error,
      ...fun,
      ...games,
      ...image,
      ...misc,
      ...moderation,
      ...music,
      ...searchers,
    };
    const selectedKey = Object.keys(allCopys).find((k) => k === key);

    if (!selectedKey) {
      return '';
    }

    /* @ts-ignore */
    let selectedCopy: string = allCopys[selectedKey];
    args?.map((a: string, i: number) => {
      selectedCopy = selectedCopy.replace(`{${i}}`, a);
    });

    return selectedCopy;
  }
}
