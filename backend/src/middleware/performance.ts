import { Request, Response, NextFunction } from 'express'
import { logger } from '../utils/logger'

export const performanceMonitor = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now()
  
  // Override res.end to capture response time
  const originalEnd = res.end
  res.end = function(chunk?: any, encoding?: any) {
    const duration = Date.now() - start
    const statusCode = res.statusCode
    
    // Log performance metrics
    logger.performance(`${req.method} ${req.path}`, duration, {
      statusCode,
      userAgent: req.get('User-Agent'),
      ip: req.ip
    })
    
    // Alert on slow responses (> 1 second)
    if (duration > 1000) {
      logger.warn(`Slow response detected: ${req.method} ${req.path} took ${duration}ms`)
    }
    
    originalEnd.call(this, chunk, encoding)
  }
  
  next()
}

export const queryMonitor = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now()
  
  // Monitor database query performance
  const originalQuery = (req as any).query
  if (originalQuery) {
    const duration = Date.now() - start
    logger.query('Database query', { query: originalQuery }, duration)
  }
  
  next()
} 