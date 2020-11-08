import { prompt } from 'enquirer';
import { Shore } from './shore';
import { GameForward, State } from './state';

const log = (msg: string) => console.log(msg);

/**
 * This contains the main application logic
 */
export class App {
  /**
   * Creates a new Application
   * @param _initialMonkeys The number of monkeys in the initial shore
   * @param _initialWolfs The number of wolfs in the initial shore
   * @param _prompt An equirer DI
   * @param _log A log DI
   */
  constructor(
    private _initialMonkeys = 3,
    private _initialWolfs = 3,
    private _prompt = prompt,
    private _log = log
  ) {}

  run(): Promise<State> {
    // Run with the initial state
    return this._doRun(
      new GameForward(
        this._prompt,
        new Shore(this._initialMonkeys, this._initialWolfs),
        new Shore(0, 0)
      )
    );
  }

  /**
   * Recursively runs the programs steps until a solution has been found or the user cancels it (via ctrl-c)
   */
  private _doRun(state: State): Promise<State> {
    // In each step we start by showing the current state
    this._log(state.showState());

    // We ask the user input and calculate the newState
    return state.step().then(([newState, errors]) => {
      // If there are some errors we print them and rerun in the same state
      if (errors.length > 0) {
        this._log('We cant do that because:');
        errors.forEach(err => this._log(`\t* ${err}`));
        return this._doRun(state);
      }

      // If we finish we return the final step, if not we recurse
      if (newState.hasFinished()) {
        this._log('Congratulations! You have solved the puzzle');
        return newState;
      } else {
        return this._doRun(newState);
      }
    });
  }
}
