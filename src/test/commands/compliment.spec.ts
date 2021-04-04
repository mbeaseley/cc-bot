import { Compliment } from '../../commands/compliment';
import { command } from '../utils/command';

describe('Compliment', () => {
  let compliment: Compliment;

  beforeEach(() => {
    compliment = new Compliment();
  });

  it('Initialize', () => {
    expect(compliment).toBeTruthy();
  });

  it('Creates compliment and replies', () => {
    compliment.instance.get = jest
      .fn()
      .mockResolvedValue({ compliment: 'Hello World!' });

    const res = command('compliment');
    const spy = jest.spyOn(res, 'reply');

    return compliment.init(res).then(() => {
      expect(spy).toHaveBeenCalledWith('Hello World!');
    });
  });

  it('Creates insult and sends', () => {
    compliment.instance.get = jest
      .fn()
      .mockResolvedValue({ compliment: 'Hello World!' });

    const res = command('compliment', '<!@>');
    res.channel.send = jest.fn();
    const spy = jest.spyOn(res.channel, 'send');

    return compliment.init(res).then(() => {
      expect(spy).toHaveBeenCalledWith('<!@>, Hello World!');
    });
  });

  it('Get empty compliment string', () => {
    compliment.instance.get = jest.fn().mockResolvedValue(undefined);

    return compliment.init(command('compliment')).catch((res) => {
      expect(res).toBeUndefined();
    });
  });
});
