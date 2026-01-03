import { Request, Response, NextFunction } from 'express'
import { ZodType, ZodError } from 'zod'
import { ValidationError } from '../errors/index.js'

export const validate = (schema: ZodType) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        params: req.params,
        query: req.query,
      })
      next()
    } catch (err) {
      if (err instanceof ZodError) {
        const messages = err.issues
          .map((e) => `${e.path.join('.')}: ${e.message}`)
          .join('; ')
        next(new ValidationError(messages))
      } else {
        next(err)
      }
    }
  }
}
