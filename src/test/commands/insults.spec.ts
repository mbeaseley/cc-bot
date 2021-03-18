import { Insult } from '../../commands/insults';
import { command } from '../utils/command';

describe('Insult', () => {
  let insult: Insult;

  beforeEach(() => {
    insult = new Insult();
  });

  it('Initialize', () => {
    expect(insult).toBeTruthy();
  });

  it('Creates insult and replies', () => {
    insult.instance.get = jest.fn().mockResolvedValue('Hello World!');

    const res = command('insult');
    const spy = jest.spyOn(res, 'reply');

    return insult.init(res).then(() => {
      expect(spy).toHaveBeenCalledWith('Hello World!');
    });
  });

  it('Creates insult and sends', () => {
    insult.instance.get = jest.fn().mockResolvedValue('Hello World!');

    const res = command('insult', '<!@>');
    res.channel.send = jest.fn();
    const spy = jest.spyOn(res.channel, 'send');

    return insult.init(res).then(() => {
      expect(spy).toHaveBeenCalledWith('<!@>, Hello World!');
    });
  });

  it('Get empty insult string', () => {
    insult.instance.get = jest.fn().mockResolvedValue('');

    return insult.init(command('insult')).catch((res) => {
      expect(res).toBeUndefined();
    });
  });
});
