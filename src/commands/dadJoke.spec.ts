import { DadJoke } from './dadJoke';

describe('sayIt', () => {
  let dadJoke: DadJoke;

  beforeEach(() => {
    dadJoke = new DadJoke();
  });

  it('initialize', () => {
    expect(dadJoke).toBeTruthy();
  });
});
