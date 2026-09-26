import { Response } from 'express';
import { ApiResponse } from '../types/api.types';

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  payload: ApiResponse<T>
): void => {
  const responseBody: ApiResponse<T> = {
    success: payload.success,
    message: payload.message,
    data: payload.data !== undefined ? payload.data : null,
    meta: payload.meta !== undefined ? payload.meta : null,
  };

  res.status(statusCode).json(responseBody);
};

export const sendSuccess = <T>(
  res: Response,
  statusCode: number = 200,
  message?: string,
  data?: T,
  meta?: any
): void => {
  sendResponse(res, statusCode, {
    success: true,
    message,
    data,
    meta,
  });
};

export const sendError = (
  res: Response,
  statusCode: number = 500,
  message: string = 'Terjadi kesalahan pada server.',
  data?: any,
  meta?: any
): void => {
  sendResponse(res, statusCode, {
    success: false,
    message,
    data,
    meta,
  });
};
