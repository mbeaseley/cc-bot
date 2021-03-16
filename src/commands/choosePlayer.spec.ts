import { ChoosePlayer } from './choosePlayer';

describe('sayIt', () => {
  let choosePlayer: ChoosePlayer;

  beforeEach(() => {
    choosePlayer = new ChoosePlayer();
  });

  it('initialize', () => {
    expect(choosePlayer).toBeTruthy();
  });
});
