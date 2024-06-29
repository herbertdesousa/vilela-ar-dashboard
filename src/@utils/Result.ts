/* eslint-disable no-shadow */
interface ResultError {
  code: string;
  payload?: unknown;
}
export type DefaultResultError = {
  code: 'UNKNOWN';
};

type ResultType<Success, Error extends ResultError> =
  | { type: 'SUCCESS'; payload: Success }
  | { type: 'ERROR'; data: Error };

export class Result<Success, Error extends ResultError> {
  // eslint-disable-next-line no-useless-constructor
  private constructor(public result: ResultType<Success, Error>) {}

  static Success<Success, Error extends ResultError>(
    payload: Success,
  ): Result<Success, Error> {
    return new Result<Success, Error>({ type: 'SUCCESS', payload });
  }

  static Error<Success, Error extends ResultError>(
    data: Error,
  ): Result<Success, Error> {
    return new Result<Success, Error>({ type: 'ERROR', data });
  }
}
