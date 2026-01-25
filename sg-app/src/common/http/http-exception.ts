export class HttpException extends Error {
  public readonly message: any;
  public readonly statusCode: number;
  constructor(
    private readonly msg: any = "Internal Server Error",
    private readonly status: number = 500
  ) {
    super(msg);
    this.message = msg;
    this.statusCode = status;
  }
}
