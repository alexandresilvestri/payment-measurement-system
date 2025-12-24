import { BaseRepository } from './BaseRepository'
import { RefreshToken, RefreshTokenDatabaseRow } from '../types/auth'

export interface IRefreshTokenRepository {
  create(token: RefreshToken): Promise<void>
  findByToken(token: string): Promise<RefreshToken | null>
  revokeToken(token: string): Promise<void>
  revokeAllUserTokens(userId: string): Promise<void>
  deleteExpiredTokens(): Promise<void>
}

class RefreshTokenRepository
  extends BaseRepository<RefreshToken, RefreshTokenDatabaseRow>
  implements IRefreshTokenRepository
{
  constructor() {
    super('refresh_tokens')
  }

  async findByToken(token: string): Promise<RefreshToken | null> {
    const row = await this.db(this.tableName)
      .where({ token })
      .whereNull('revoked_at')
      .where('expires_at', '>', new Date())
      .first()

    return row ? this.toDomain(row) : null
  }

  async revokeToken(token: string): Promise<void> {
    await this.db(this.tableName)
      .where({ token })
      .update({ revoked_at: new Date() })
  }

  async revokeAllUserTokens(userId: string): Promise<void> {
    await this.db(this.tableName)
      .where({ user_id: userId })
      .update({ revoked_at: new Date() })
  }

  async deleteExpiredTokens(): Promise<void> {
    await this.db(this.tableName).where('expires_at', '<', new Date()).delete()
  }

  protected toDomain(row: RefreshTokenDatabaseRow): RefreshToken {
    return {
      id: row.id,
      userId: row.user_id,
      token: row.token,
      expiresAt: row.expires_at,
      createdAt: row.created_at,
      revokedAt: row.revoked_at,
    }
  }

  protected toDatabase(token: RefreshToken): Partial<RefreshTokenDatabaseRow> {
    return {
      id: token.id,
      user_id: token.userId,
      token: token.token,
      expires_at: token.expiresAt,
      created_at: token.createdAt,
      revoked_at: token.revokedAt,
    }
  }
}

export const refreshTokenRepository = new RefreshTokenRepository()
