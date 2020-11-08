import { assert } from 'chai';
import 'mocha';
import { spy } from 'sinon';
import { App } from './app';
import { createInputStub } from './test_helper';

describe('App', () => {
  const inputs = [
    // 1 wolf and 1 monkey row there, monkey rows back.
    ['Wolf', 'Monkey'],
    ['Monkey', 'Empty'],
    // 2 wolves row there, 1 wolf rows back.
    ['Wolf', 'Wolf'],
    ['Wolf', 'Empty'],
    // 2 monkeys row there, 1 monkey and 1 wolf rows back.
    ['Monkey', 'Monkey'],
    ['Monkey', 'Wolf'],
    // 2 monkeys row there, 1 wolf rows back.
    ['Monkey', 'Monkey'],
    ['Wolf', 'Empty'],
    // This one wolf takes the remaining wolves to the other side.
    ['Wolf', 'Wolf'],
    ['Wolf', 'Empty'],
    ['Wolf', 'Wolf'],
  ];
  it('Should be possible to win', async () => {
    const app = new App(3, 3, createInputStub(inputs), () => {});
    const state = await app.run();

    assert.equal(state.hasFinished(), true);
  });

  it('Should congratulate you when you win', async () => {
    const log = spy();
    const app = new App(3, 3, createInputStub(inputs), log);
    await app.run();

    const msg = 'Congratulations! You have solved the puzzle';

    assert.equal(log.calledWith(msg), true);
  });
});
