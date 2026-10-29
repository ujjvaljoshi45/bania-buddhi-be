import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface StandardResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, StandardResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<StandardResponse<T>> {
    const response = context.switchToHttp().getResponse();
    const defaultStatusCode = response?.statusCode || HttpStatus.OK;

    return next.handle().pipe(
      map((resData) => {
        // If already in standardized ResponseDto shape
        if (
          resData &&
          typeof resData === 'object' &&
          'message' in resData &&
          'data' in resData &&
          ('statusCode' in resData || 'status' in resData)
        ) {
          const code =
            resData.statusCode ?? resData.status ?? defaultStatusCode;
          if (response?.status) {
            response.status(code);
          }
          return {
            statusCode: code,
            message: resData.message ?? 'Success',
            data: resData.data,
          };
        }

        return {
          statusCode: defaultStatusCode,
          message: 'Success',
          data: resData ?? null,
        };
      }),
    );
  }
}

