import { prompt } from 'enquirer';
import { stub } from 'sinon';

export function createInputStub(inputs: string[][]) {
  const s = stub();
  inputs.forEach((input, index) => {
    s.onCall(index).resolves({
      first: input[0],
      second: input[1],
    });
  });
  s.rejects('No more input');
  return s as typeof prompt;
}
