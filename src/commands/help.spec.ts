import { Help } from './help';

describe('sayIt', () => {
  let help: Help;

  beforeEach(() => {
    help = new Help();
  });

  it('initialize', () => {
    expect(help).toBeTruthy();
  });
});
