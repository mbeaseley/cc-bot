export class AdviceItem {
  id: number | undefined;
  advice: string | undefined;

  constructor(id: number, advice: string) {
    this.id = id;
    this.advice = advice;
  }
}
