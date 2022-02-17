import { HttpStatus } from '@nestjs/common';
import { Response } from '../interfaces/response.interface';

export const badRequest = (error: string): Response => ({
  statusCode: HttpStatus.BAD_REQUEST,
  error: error,
});

export const notFound = (error: string): Response => ({
  statusCode: HttpStatus.NOT_FOUND,
  error: error,
});

export const serverError = (): Response => ({
  statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  error: 'Internal Server Error',
});

export const created = (data: any): Response => ({
  statusCode: HttpStatus.CREATED,
  data: data,
});

export const ok = (data: any): Response => ({
  statusCode: HttpStatus.OK,
  data: data,
});
