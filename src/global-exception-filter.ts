import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { throwError } from 'rxjs';
import { QueryFailedError } from 'typeorm';

@Catch()
export class GlobalExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, _: ArgumentsHost) {
    console.log(exception);
    if (exception instanceof RpcException) {
      // If it's already an RcpException, leave it unchanged
      return throwError(() => exception);
    } else if (exception instanceof HttpException) {
      return throwError(() => new RpcException(exception.getResponse()));
    } else if (exception instanceof QueryFailedError) {
      return throwError(() => new RpcException(exception.message));
    } else {
      return throwError(() => exception);
    }
  }
}
