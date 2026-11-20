import { RequestHandler } from "express";

/** Forwards rejected async controller promises to the shared error middleware (Express 4). */
export function asyncHandler(fn: (...args: any[]) => Promise<unknown>): RequestHandler {
  return (req, res, next) => {
    void Promise.resolve(fn(req, res, next)).catch(next);
  };
}
