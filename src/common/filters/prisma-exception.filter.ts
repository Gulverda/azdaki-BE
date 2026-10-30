import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import type { Response } from 'express';

/**
 * Prisma-ს შეცდომებს აქცევს გასაგებ HTTP პასუხებად, რომ ყველა service-ში
 * try/catch არ დაგვჭირდეს. მაგ.: არარსებული id → 404, დაკავებული slug → 409.
 */
@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();

    switch (exception.code) {
      case 'P2002': {
        const target = exception.meta?.target;
        const fields = Array.isArray(target) ? target.join(', ') : 'field';
        return this.send(
          response,
          HttpStatus.CONFLICT,
          `${fields} already exists`,
        );
      }
      case 'P2025':
        return this.send(response, HttpStatus.NOT_FOUND, 'Record not found');
      case 'P2003':
        return this.send(
          response,
          HttpStatus.BAD_REQUEST,
          'Related record not found',
        );
      default:
        return super.catch(exception, host);
    }
  }

  private send(response: Response, statusCode: HttpStatus, message: string) {
    response.status(statusCode).json({ statusCode, message });
  }
}
