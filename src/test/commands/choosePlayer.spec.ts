import { ChoosePlayer } from '../../commands/choosePlayer';
import { command } from '../utils/command';

describe('ChoosePlayer', () => {
  let choosePlayer: ChoosePlayer;

  beforeEach(() => {
    choosePlayer = new ChoosePlayer();
  });

  it('initialize', () => {
    expect(choosePlayer).toBeTruthy();
  });
});
