class ApiResponse {
  statusCode: number;
  data: any;
  message: string;
  status: boolean;

  constructor(statusCode: number, data: any, message: string = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.status = statusCode < 400;
  }
}

export { ApiResponse };