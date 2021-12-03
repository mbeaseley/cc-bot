export class Animal {
  link: string | undefined;

  constructor(link?: string) {
    this.link = link;
  }
}

export type AnimalKind = 'cat' | 'dog' | 'panda' | 'red_panda' | 'birb' | 'fox' | 'koala';
