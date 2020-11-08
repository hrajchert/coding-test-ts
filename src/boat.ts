import { prompt } from 'enquirer';
import { oneOf, strictObjOf } from 'parmenides';
import { Shore } from './shore';

const boatInputContract = strictObjOf({
  first: oneOf('Monkey', 'Wolf'),
  second: oneOf('Monkey', 'Wolf', 'Empty'),
});

type Direction = 'forward' | 'backward';
export class Boat {
  readonly wolfs: number;
  readonly monkeys: number;

  private constructor(input: object, public direction: Direction) {
    // Validate that the input is as expected or throw (should not happen as we provide a select)
    const boat = boatInputContract(input as any);

    // Count how many monkeys and wolfs are in the boat
    this.monkeys =
      (boat.first === 'Monkey' ? 1 : 0) + (boat.second === 'Monkey' ? 1 : 0);
    this.wolfs =
      (boat.first === 'Wolf' ? 1 : 0) + (boat.second === 'Wolf' ? 1 : 0);
  }

  validateTrip(shore: Shore) {
    const errors = [] as string[];
    // Check initial state validations
    if (this.monkeys > shore.monkeys) {
      errors.push("There aren't that many monkeys to move to the other shore");
    }

    if (this.wolfs > shore.wolfs) {
      errors.push("There aren't that many wolfs to move to the other shore");
    }
    return errors;
  }

  static promptUser(_prompt: typeof prompt, direction: Direction) {
    return _prompt([
      {
        name: 'first',
        type: 'select',
        message: `What is the first animal to row ${direction}`,
        choices: ['Monkey', 'Wolf'],
      },
      {
        name: 'second',
        type: 'select',
        message: `What is the second animal to row ${direction}`,
        choices: ['Monkey', 'Wolf', 'Empty'],
      },
    ]).then(input => new Boat(input, direction));
  }
}
