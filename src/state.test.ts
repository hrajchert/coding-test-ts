import { assert } from 'chai';
import 'mocha';
import { Shore } from './shore';
import { GameBackward, GameForward } from './state';
import { createInputStub } from './test_helper';

describe('GameForward', () => {
  it('Should be possible to make a valid move forward', async () => {
    const input = [['Monkey', 'Wolf']];
    const state = new GameForward(
      createInputStub(input),
      new Shore(3, 3),
      new Shore(0, 0)
    );

    const [newState, errors] = await state.step();
    assert.equal(newState.initial.wolfs, 2);
    assert.equal(newState.initial.monkeys, 2);
    assert.equal(newState.final.wolfs, 1);
    assert.equal(newState.final.monkeys, 1);
    assert.deepEqual(errors, []);
  });

  it('Should not be possible to leave more wolves than monkeys in the initial shore moving forward', async () => {
    const input = [['Monkey', 'Monkey']];
    const state = new GameForward(
      createInputStub(input),
      new Shore(3, 3),
      new Shore(0, 0)
    );

    const [newState, errors] = await state.step();
    assert.equal(newState, state);
    assert.deepEqual(errors, [
      'There are more wolfs than monkeys in the initial coast, tragedies may happen',
    ]);
  });

  it('Should not be possible to leave more wolves than monkeys in the final shore moving forward', async () => {
    const input = [['Wolf', 'Wolf']];
    const state = new GameForward(
      createInputStub(input),
      new Shore(3, 2),
      new Shore(0, 1)
    );

    const [newState, errors] = await state.step();
    assert.equal(newState, state);
    assert.deepEqual(errors, [
      'There are more wolfs than monkeys in the final coast, tragedies may happen',
    ]);
  });

  it('Should not be possible to move forward more monkeys than the ones we have', async () => {
    const input = [['Monkey', 'Wolf']];
    const state = new GameForward(
      createInputStub(input),
      new Shore(3, 0),
      new Shore(0, 3)
    );

    const [newState, errors] = await state.step();
    assert.equal(newState, state);
    assert.deepEqual(errors, [
      "There aren't that many monkeys to move to the other shore",
    ]);
  });

  it('Should not be possible to move forward more wolves than the ones we have', async () => {
    const input = [['Wolf', 'Wolf']];
    const state = new GameForward(
      createInputStub(input),
      new Shore(1, 1),
      new Shore(2, 2)
    );

    const [newState, errors] = await state.step();

    assert.equal(newState, state);
    assert.deepEqual(errors, [
      "There aren't that many wolfs to move to the other shore",
    ]);
  });

  it('Should be possible to leave more wolves than monkeys in the final shore, if there are no monkeys', async () => {
    const input = [['Wolf', 'Wolf']];
    const state = new GameForward(
      createInputStub(input),
      new Shore(3, 3),
      new Shore(0, 0)
    );

    const [newState, errors] = await state.step();
    assert.equal(newState.initial.wolfs, 1);
    assert.equal(newState.initial.monkeys, 3);
    assert.equal(newState.final.wolfs, 2);
    assert.equal(newState.final.monkeys, 0);
    assert.deepEqual(errors, []);
  });
});

describe('GameBackward', () => {
  it('Should be possible to make a valid move backward', async () => {
    const input = [['Monkey', 'Empty']];
    const state = new GameBackward(
      createInputStub(input),
      new Shore(2, 2),
      new Shore(1, 1)
    );

    const [newState, errors] = await state.step();
    assert.equal(newState.initial.wolfs, 2);
    assert.equal(newState.initial.monkeys, 3);
    assert.equal(newState.final.wolfs, 1);
    assert.equal(newState.final.monkeys, 0);
    assert.deepEqual(errors, []);
  });

  it('Should not be possible to leave more wolves than monkeys in the initial shore moving backwards', async () => {
    const input = [['Wolf', 'Empty']];
    const state = new GameBackward(
      createInputStub(input),
      new Shore(1, 1),
      new Shore(2, 2)
    );

    const [newState, errors] = await state.step();
    assert.equal(newState, state);
    assert.deepEqual(errors, [
      'There are more wolfs than monkeys in the initial coast, tragedies may happen',
    ]);
  });

  it('Should not be possible to leave more wolves than monkeys in the final shore moving backwards', async () => {
    const input = [['Monkey', 'Empty']];
    const state = new GameBackward(
      createInputStub(input),
      new Shore(1, 1),
      new Shore(2, 2)
    );

    const [newState, errors] = await state.step();
    assert.equal(newState, state);
    assert.deepEqual(errors, [
      'There are more wolfs than monkeys in the final coast, tragedies may happen',
    ]);
  });

  it('Should not be possible to move backwards more monkeys than the ones we have', async () => {
    const input = [['Monkey', 'Monkey']];
    const state = new GameBackward(
      createInputStub(input),
      new Shore(2, 2),
      new Shore(1, 1)
    );

    const [newState, errors] = await state.step();
    assert.equal(newState, state);
    assert.deepEqual(errors, [
      "There aren't that many monkeys to move to the other shore",
    ]);
  });

  it('Should not be possible to move backwards more wolves than the ones we have', async () => {
    const input = [['Wolf', 'Wolf']];

    const state = new GameBackward(
      createInputStub(input),
      new Shore(2, 3),
      new Shore(1, 0)
    );

    const [newState, errors] = await state.step();

    assert.equal(newState, state);
    assert.deepEqual(errors, [
      "There aren't that many wolfs to move to the other shore",
    ]);
  });

  it('Should be possible to leave more wolves than monkeys in the initial shore, if there are no monkeys', async () => {
    const input = [['Wolf', 'Empty']];
    const state = new GameBackward(
      createInputStub(input),
      new Shore(2, 0),
      new Shore(1, 3)
    );

    const [newState, errors] = await state.step();
    assert.equal(newState.initial.wolfs, 3);
    assert.equal(newState.initial.monkeys, 0);
    assert.equal(newState.final.wolfs, 0);
    assert.equal(newState.final.monkeys, 3);
    assert.deepEqual(errors, []);
  });
});
