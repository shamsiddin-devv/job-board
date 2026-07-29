import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common'
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

    console.error('Unexpected error:', exception)
    return response.status(500).json({
      error: 'A server error occurred.',
    })
  }
}