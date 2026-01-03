import { ConflictError } from '../errors/index.js'

export function duplicateError(err: unknown, table: string, value: string) {
  const duplicateMessage = `"${table}_${value}_unique"`
  if (
    err instanceof Error &&
    err.message.includes(
      `duplicate key value violates unique constraint ${duplicateMessage}`
    )
  ) {
    throw new ConflictError(`${value} already exists`)
  }
}
