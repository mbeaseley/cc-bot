export class Joke {
  id: number | undefined;
  joke?: string;
  delivery?: string | undefined;

  constructor(id: number, joke: string, delivery?: string) {
    this.id = id;
    this.joke = joke ?? '';
    this.delivery = delivery;
  }
}
