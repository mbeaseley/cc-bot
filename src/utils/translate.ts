import { admin } from 'Language/admin';
import { error } from 'Language/error';

export default class Translate {
  static find(key: string, args?: string[]): string {
    const allCopys = { ...admin, ...error };
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
