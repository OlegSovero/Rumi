import type { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('🔥 Global error handler:', err);

  res.status(500).json({
    error: 'Internal server error',
    message: err.message || 'An unexpected error occurred',
  });
};

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    error: 'Not found',
    message: `Route ${req.method} ${req.path} not found`,
  });
};
