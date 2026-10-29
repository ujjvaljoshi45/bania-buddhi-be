import { HttpStatus } from '@nestjs/common';

export class ResponseDto<T> {
  data: T;
  message: string;
  statusCode: number;

  constructor(data: T, message: string, statusCode: HttpStatus = HttpStatus.OK) {
    this.data = data;
    this.message = message;
    this.statusCode = statusCode;
  }

  get status(): HttpStatus {
    return this.statusCode;
  }

  static success<T>(
    data: T,
    message: string = 'Success',
    status: HttpStatus = HttpStatus.OK,
  ): ResponseDto<T> {
    return new ResponseDto(data, message, status);
  }

  static error<T>(
    data: T,
    message: string,
    status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
  ): ResponseDto<T> {
    return new ResponseDto(data, message, status);
  }
}

