import { UseInterceptors, applyDecorators } from '@nestjs/common';
import { ApiHeader, ApiQuery } from '@nestjs/swagger';
import { LocalizeInterceptor } from '../interceptors/localize.interceptor';
import { LANGS } from './lang';

/**
 * საკუთარი decorator, რომელიც რამდენიმე decorator-ს აერთიანებს:
 * თარგმნის interceptor + swagger-ის დოკუმენტაცია `lang` პარამეტრისთვის.
 */
export const Localized = () =>
  applyDecorators(
    UseInterceptors(LocalizeInterceptor),
    ApiQuery({ name: 'lang', required: false, enum: LANGS }),
    ApiHeader({ name: 'Accept-Language', required: false }),
  );
