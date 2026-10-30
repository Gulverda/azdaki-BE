import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import type { Request } from 'express';
import { Observable, map } from 'rxjs';
import { resolveLang } from '../i18n/lang';
import { localize } from '../i18n/localize';

/**
 * Interceptor ეშვება handler-ამდე და მის შემდეგ. აქ ვიღებთ handler-ის პასუხს
 * და ვთარგმნით მოთხოვნილ ენაზე. ვიყენებთ მხოლოდ საჯარო controller-ებზე,
 * ადმინკას ორივე ენა ერთად სჭირდება.
 */
@Injectable()
export class LocalizeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const lang = resolveLang(context.switchToHttp().getRequest<Request>());
    return next.handle().pipe(map((data) => localize(data, lang)));
  }
}
