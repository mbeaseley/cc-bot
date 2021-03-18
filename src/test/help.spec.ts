import { Help } from '../commands/help';

describe('Help', () => {
  let help: Help;

  beforeEach(() => {
    help = new Help();
  });

  it('initialize', () => {
    expect(help).toBeTruthy();
  });
});
