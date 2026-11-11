import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { Response } from 'express'
import { DomainError } from 'src/domain/errors/DomainError'

@Catch()
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    if (exception instanceof DomainError) {
      return response.status(exception.status).json({
        error: exception.message,
      })
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus()
      const errorResponse = exception.getResponse()
      return response.status(status).json(
        typeof errorResponse === 'string'
          ? { error: errorResponse }
          : errorResponse,
      )
    }

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      if (exception.code === 'P2002') return response.status(409).json({ error: 'Resource already exists.' });
      if (exception.code === 'P2025') return response.status(404).json({ error: 'Resource not found.' });
    }

    if (exception instanceof Error) {
      const frames = exception.stack?.split('\n').filter((line) => line.startsWith('    at ')).join('\n');
      Logger.error(exception.name, frames, 'HTTP');
    } else {
      Logger.error('Unknown error', 'HTTP');
    }
    return response.status(500).json({
      error: 'A server error occurred.',
    })
  }
}