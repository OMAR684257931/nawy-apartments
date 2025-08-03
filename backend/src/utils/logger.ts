interface LogLevel {
  ERROR: 'error'
  WARN: 'warn'
  INFO: 'info'
  DEBUG: 'debug'
}

const LOG_LEVELS: LogLevel = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug'
}

class Logger {
  private formatMessage(level: string, message: string, meta?: any): string {
    const timestamp = new Date().toISOString()
    const metaStr = meta ? ` | ${JSON.stringify(meta)}` : ''
    return `[${timestamp}] ${level.toUpperCase()}: ${message}${metaStr}`
  }

  error(message: string, error?: any): void {
    const errorDetails = error ? {
      message: error.message,
      stack: error.stack,
      ...error
    } : undefined
    
    console.error(this.formatMessage(LOG_LEVELS.ERROR, message, errorDetails))
  }

  warn(message: string, meta?: any): void {
    console.warn(this.formatMessage(LOG_LEVELS.WARN, message, meta))
  }

  info(message: string, meta?: any): void {
    console.info(this.formatMessage(LOG_LEVELS.INFO, message, meta))
  }

  debug(message: string, meta?: any): void {
    if (process.env.NODE_ENV === 'development') {
      console.debug(this.formatMessage(LOG_LEVELS.DEBUG, message, meta))
    }
  }

  // Performance logging
  performance(operation: string, duration: number, meta?: any): void {
    this.info(`Performance: ${operation} took ${duration}ms`, meta)
  }

  // Database query logging
  query(sql: string, params: any, duration: number): void {
    this.debug(`Database Query: ${sql}`, { params, duration })
  }

  // API request logging
  request(method: string, url: string, duration: number, statusCode: number): void {
    this.info(`API Request: ${method} ${url}`, { duration, statusCode })
  }
}

export const logger = new Logger() 