export class IError extends Error {
  public messageClient: string;
  public errorCode: number;
  public statusHttp: number;

  constructor(message: string, errorCode: number, statusHttp: number = 500, messageClient?: string) {
    super(message);
    Object.setPrototypeOf(this, IError.prototype);

    this.name = this.constructor.name;
    this.messageClient = messageClient || message;
    this.errorCode = errorCode;
    this.statusHttp = statusHttp;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      messageClient: this.messageClient,
      errorCode: this.errorCode,
      statusHttp: this.statusHttp,
    };
  }
}
