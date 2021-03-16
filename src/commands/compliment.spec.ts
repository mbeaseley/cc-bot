import { Compliment } from './compliment';

describe('sayIt', () => {
  let compliment: Compliment;

  beforeEach(() => {
    compliment = new Compliment();
  });

  it('initialize', () => {
    expect(compliment).toBeTruthy();
  });
});
