import { admin } from 'Assets/language/admin';
import { error } from 'Assets/language/error';
import { fun } from 'Assets/language/fun';
import { games } from 'Assets/language/games';
import { image } from 'Assets/language/image';
import { misc } from 'Assets/language/misc';
import { moderation } from 'Assets/language/moderation';
import { music } from 'Assets/language/music';
import { searchers } from 'Assets/language/searchers';

interface Copy {
  [key: string]: string;
}

export class Command {
  copy!: Copy;

  constructor() {
    this.copy = {
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
  }

  /**
   * Find correct translate copy
   * @param key
   * @param args
   * @returns string
   */
  public c(key: string, ...args: string[]): string {
    const selectedKey = Object.keys(this.copy).find((k) => k === key);

    if (!selectedKey) {
      return '';
    }

    let selectedCopy: string = this.copy[selectedKey];
    args?.map((a: string, i: number) => {
      selectedCopy = selectedCopy.replace(`{${i}}`, a);
    });

    return selectedCopy;
  }

  /**
   * Find correct translate copy and make first letter uppercase
   * @param key
   * @param args
   * @returns string
   */
  public cBold(key: string, ...args: string[]): string {
    const c = this.c(key, ...args);

    let firstLetter = false;
    const letters = c
      .toLowerCase()
      .split('')
      .map((l) => {
        if (/[a-zA-Z]/.test(l) && !firstLetter) {
          firstLetter = true;
          return l.toUpperCase();
        }

        return l;
      });

    return letters.join();
  }
}
