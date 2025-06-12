class ApiError extends Error {
  public statusCode: number;
  public data: any;
  public status: boolean;
  public errors: any[];

  constructor(
    statusCode: number = 500,
    message: string = "Something went wrong",
    errors: any[] = [],
    stack?: string
  ) {
    super(message); //when we need to override, then we call super keyword
    
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.status = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
