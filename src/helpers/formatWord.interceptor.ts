import { Injectable, ExecutionContext, NestInterceptor, CallHandler } from '@nestjs/common';
import { removeSpecialCharacters } from './helpers';

@Injectable()
export class formatWordInterceptor implements NestInterceptor {

    intercept(context: ExecutionContext, next: CallHandler<any>) {
        
        const request: any = context.switchToHttp().getRequest();

        if (request.body.search) {
            request.body.search = removeSpecialCharacters(request.body.search);
        }

        return next.handle();
    }
}