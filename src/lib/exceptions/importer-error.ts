export class ImporterError extends Error {
  code: string;

  constructor(message: string, code: string = 'SYNTAX_ERROR') {
    super(message);

    this.name = 'ImporterError';
    this.code = code;

    Object.setPrototypeOf(this, new.target.prototype);
  }
}
