/**
 * Structured logging utility for GetReceipts.org
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  userId?: string;
  claimId?: string;
  ip?: string;
  userAgent?: string;
  path?: string;
  method?: string;
  duration?: number;
  [key: string]: unknown;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  private formatMessage(level: LogLevel, message: string, context?: LogContext) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level: level.toUpperCase(),
      message,
      ...context,
    };

    return this.isDevelopment 
      ? JSON.stringify(logEntry, null, 2)
      : JSON.stringify(logEntry);
  }

  debug(message: string, context?: LogContext) {
    if (this.isDevelopment) {
      console.log(this.formatMessage('debug', message, context));
    }
  }

  info(message: string, context?: LogContext) {
    console.log(this.formatMessage('info', message, context));
  }

  warn(message: string, context?: LogContext) {
    console.warn(this.formatMessage('warn', message, context));
  }

  error(message: string, error?: Error, context?: LogContext) {
    const errorContext = error ? {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
      ...context,
    } : context;

    console.error(this.formatMessage('error', message, errorContext));
  }

  // API request logging
  apiRequest(method: string, path: string, ip: string, userAgent?: string) {
    this.info('API Request', {
      method,
      path,
      ip,
      userAgent,
    });
  }

  // API response logging
  apiResponse(method: string, path: string, statusCode: number, duration: number, context?: LogContext) {
    const level = statusCode >= 400 ? 'warn' : 'info';
    this[level]('API Response', {
      method,
      path,
      statusCode,
      duration,
      ...context,
    });
  }

  // Database operation logging
  dbOperation(operation: string, table: string, duration?: number, context?: LogContext) {
    this.debug('Database Operation', {
      operation,
      table,
      duration,
      ...context,
    });
  }

  // Rate limiting logging
  rateLimitHit(ip: string, path: string, limit: number) {
    this.warn('Rate Limit Hit', {
      ip,
      path,
      limit,
    });
  }

  // Validation error logging
  validationError(path: string, errors: unknown, context?: LogContext) {
    this.warn('Validation Error', {
      path,
      errors,
      ...context,
    });
  }
}

export const logger = new Logger();

// Middleware helper for API route logging
export function withLogging<T extends unknown[]>(
  handler: (...args: T) => Promise<Response>,
  operation: string
) {
  return async (...args: T): Promise<Response> => {
    const startTime = Date.now();
    const request = args[0] as Request;
    
    try {
      const url = new URL(request.url);
      const ip = request.headers.get('x-forwarded-for') || 'unknown';
      const userAgent = request.headers.get('user-agent');
      
      logger.apiRequest(request.method, url.pathname, ip, userAgent || undefined);
      
      const response = await handler(...args);
      const duration = Date.now() - startTime;
      
      logger.apiResponse(request.method, url.pathname, response.status, duration, {
        operation,
      });
      
      return response;
    } catch (error) {
      const duration = Date.now() - startTime;
      const url = new URL(request.url);
      
      logger.error(`${operation} failed`, error as Error, {
        method: request.method,
        path: url.pathname,
        duration,
      });
      
      throw error;
    }
  };
}
