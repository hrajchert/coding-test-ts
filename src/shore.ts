/**
 * Represents one of the possible shores
 */
export class Shore {
  constructor(public readonly wolfs: number, public readonly monkeys: number) {}

  /** To avoid a tragedy there shouldn't be more wolfs than monkeys in a shore */
  hasTragedy() {
    return this.monkeys > 0 && this.wolfs > this.monkeys;
  }

  showShore(shoreName: string) {
    return `the ${shoreName} shore has ${this.monkeys} monkeys and ${this.wolfs} wolfs`;
  }
}
