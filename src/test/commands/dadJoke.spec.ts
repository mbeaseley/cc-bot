import { DadJoke, JokeResponse } from '../../commands/dadJoke';
import { command } from '../utils/command';

describe('DadJoke', () => {
  let dadJoke: DadJoke;

  beforeEach(() => {
    dadJoke = new DadJoke();
  });

  it('initialize', () => {
    expect(dadJoke).toBeTruthy();
  });

  it('Gets joke and replies', () => {
    const mockResponse: JokeResponse = {
      id: '1',
      joke: 'Funny Joke Here',
      status: 200,
    };
    dadJoke.instance.get = jest.fn().mockResolvedValue(mockResponse);

    const res = command('joke');

    const spy = jest.spyOn(res, 'reply');
    return dadJoke.init(res).then(() => {
      expect(spy).toHaveBeenCalledWith(mockResponse.joke);
    });
  });

  it('Get empty joke object and rejects', () => {
    dadJoke.instance.get = jest.fn().mockResolvedValue(undefined);
    const res = command('joke');

    return dadJoke.init(res).catch((res) => {
      expect(res).toBeUndefined();
    });
  });

  it('Get empty joke and rejects', () => {
    dadJoke.instance.get = jest.fn().mockResolvedValue({});
    const res = command('joke');

    return dadJoke.init(res).catch((res) => {
      expect(res).toBeUndefined();
    });
  });
});
