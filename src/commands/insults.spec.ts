import { Insult } from './insults';

describe('sayIt', () => {
  let insult: Insult;

  beforeEach(() => {
    insult = new Insult();
  });

  it('initialize', () => {
    expect(insult).toBeTruthy();
  });
});
