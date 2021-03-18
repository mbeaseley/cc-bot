import { ChoosePlayer } from '../commands/choosePlayer';

describe('ChoosePlayer', () => {
  let choosePlayer: ChoosePlayer;

  beforeEach(() => {
    choosePlayer = new ChoosePlayer();
  });

  it('initialize', () => {
    expect(choosePlayer).toBeTruthy();
  });
});
