import { Insult } from '../../commands/insults';
import { command } from '../utils/command';

describe('Insult', () => {
  let insult: Insult;

  beforeEach(() => {
    insult = new Insult();
  });

  it('initialize', () => {
    expect(insult).toBeTruthy();
  });

  it('creates insult and replies', () => {
    insult.getRandomInsult = jest.fn().mockResolvedValue('Hello World!');

    const res = command('insult');
    const spy = jest.spyOn(res, 'reply');

    return insult.init(res).then(() => {
      expect(spy).toHaveBeenCalledWith('Hello World!');
    });
  });

  it('creates insult and sends', () => {
    insult.getRandomInsult = jest.fn().mockResolvedValue('Hello World!');

    const res = command('insult', '<!@>');
    res.channel.send = jest.fn();
    const spy = jest.spyOn(res.channel, 'send');

    return insult.init(res).then(() => {
      expect(spy).toHaveBeenCalledWith('<!@>, Hello World!');
    });
  });
});
