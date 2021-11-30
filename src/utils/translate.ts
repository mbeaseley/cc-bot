import { admin } from 'Assets/language/admin';
import { error } from 'Assets/language/error';
import { fun } from 'Assets/language/fun';
import { games } from 'Assets/language/games';
import { image } from 'Assets/language/image';
import { misc } from 'Assets/language/misc';
import { moderation } from 'Assets/language/moderation';
import { music } from 'Assets/language/music';
import { searchers } from 'Assets/language/searchers';

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
      ...searchers
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
