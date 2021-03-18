import { DadJoke } from '../commands/dadJoke';

describe('DadJoke', () => {
  let dadJoke: DadJoke;

  beforeEach(() => {
    dadJoke = new DadJoke();
  });

  it('initialize', () => {
    expect(dadJoke).toBeTruthy();
  });
});
