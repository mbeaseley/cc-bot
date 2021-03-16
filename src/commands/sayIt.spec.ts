import { SayIt } from './sayIt';

describe('sayIt', () => {
  let sayIt: SayIt;

  beforeEach(() => {
    sayIt = new SayIt();
  });

  it('initialize', () => {
    expect(sayIt).toBeTruthy();
  });

  // it('on init runs complient', () => {
  //   Math.round = jest.fn().mockReturnValue(1);

  //   const spy = jest.spyOn(sayIt.compliment, 'init');
  //   return sayIt.init(expect.anything()).then(() => {
  //     expect(spy).toHaveBeenCalled();
  //   });
  // });

  // xit('on init runs insult', () => {
  //   Math.round = jest.fn().mockReturnValue(0);

  //   const spy = jest.spyOn(sayIt.insult, 'init');
  //   return sayIt.init(expect.anything()).then(() => {
  //     expect(spy).toHaveBeenCalled();
  //   });
  // });
});
