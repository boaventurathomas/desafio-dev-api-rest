import { HttpStatus } from '@nestjs/common';

export interface HttpResponse {
  statusCode: number
  data: any
}

export const badRequest = (error: string): HttpResponse => ({
  statusCode: HttpStatus.BAD_REQUEST,
  data: error,
});

export const notFound = (error: string): HttpResponse => ({
  statusCode: HttpStatus.NOT_FOUND,
  data: error,
});

export const serverError = (): HttpResponse => ({
  statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  data: 'Internal Server Error',
});

export const created = (data: any): HttpResponse => ({
  statusCode: HttpStatus.CREATED,
  data: data,
});

export const ok = (data: any): HttpResponse => ({
  statusCode: HttpStatus.OK,
  data: data,
});
