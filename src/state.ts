import { prompt } from 'enquirer';
import { Boat } from './boat';
import { Shore } from './shore';

export abstract class State {
  abstract initial: Shore;
  abstract final: Shore;
  abstract step(): Promise<readonly [State, string[]]>;
  abstract hasFinished(): boolean;
  abstract showState(): string;

  validateState() {
    const errors = [] as string[];
    // Check final state validations
    if (this.initial.hasTragedy()) {
      errors.push(
        'There are more wolfs than monkeys in the initial coast, tragedies may happen'
      );
    }

    if (this.final.hasTragedy()) {
      errors.push(
        'There are more wolfs than monkeys in the final coast, tragedies may happen'
      );
    }
    return errors;
  }
}

export class GameForward extends State {
  constructor(
    private _prompt: typeof prompt,
    readonly initial: Shore,
    readonly final: Shore
  ) {
    super();
  }

  showState() {
    return (
      'The boat is moving forwards, ' +
      this.initial.showShore('initial') +
      ' and ' +
      this.final.showShore('final')
    );
  }

  async step(): Promise<readonly [State, string[]]> {
    // ask the user who is travelling
    const boat = await Boat.promptUser(this._prompt, 'forward');
    // Validate that we can make the trip
    let errors = boat.validateTrip(this.initial);
    if (errors.length > 0) {
      return [this, errors];
    }
    // Calculate the new state
    const newState = new GameBackward(
      this._prompt,
      new Shore(
        this.initial.wolfs - boat.wolfs,
        this.initial.monkeys - boat.monkeys
      ),
      new Shore(
        this.final.wolfs + boat.wolfs,
        this.final.monkeys + boat.monkeys
      )
    );
    // And return it, if valid
    errors = newState.validateState();
    if (errors.length > 0) {
      return [this, errors];
    } else {
      return [newState, []];
    }
  }

  hasFinished() {
    return false;
  }
}

export class GameBackward extends State {
  constructor(
    private _prompt: typeof prompt,
    readonly initial: Shore,
    readonly final: Shore
  ) {
    super();
  }
  showState() {
    const initiaShore = this.initial.showShore('initial');
    const finalShore = this.final.showShore('final');
    return `The boat is moving backwards, ${initiaShore} and ${finalShore}`;
  }

  step(): Promise<readonly [State, string[]]> {
    // ask the user who is travelling
    return Boat.promptUser(this._prompt, 'backward').then(boat => {
      // Validate that we can make the trip
      let errors = boat.validateTrip(this.final);

      if (errors.length > 0) {
        return [this, errors];
      }

      // Calculate the new state
      const newState = new GameForward(
        this._prompt,
        new Shore(
          this.initial.wolfs + boat.wolfs,
          this.initial.monkeys + boat.monkeys
        ),
        new Shore(
          this.final.wolfs - boat.wolfs,
          this.final.monkeys - boat.monkeys
        )
      );

      // And return it, if valid
      errors = newState.validateState();

      if (errors.length > 0) {
        return [this, errors];
      } else {
        return [newState, []];
      }
    });
  }

  hasFinished() {
    return this.initial.monkeys === 0 && this.initial.wolfs === 0;
  }
}
