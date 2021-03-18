import { Compliment } from '../../commands/compliment';

describe('Compliment', () => {
  let compliment: Compliment;

  beforeEach(() => {
    compliment = new Compliment();
  });

  it('initialize', () => {
    expect(compliment).toBeTruthy();
  });
});
