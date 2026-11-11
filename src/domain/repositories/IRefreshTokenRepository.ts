import { RefreshToken } from "../entities/RefreshToken";

export interface IRefreshTokenRepository {
  findById(tokenId: string): Promise<RefreshToken | null>
  findByToken(token: string): Promise<RefreshToken | null>
  findByUserId(userId: string): Promise<RefreshToken | null>
  updateManyByUserId(userId: string, isRevoked: boolean): Promise<void | null>
  findAll(): Promise<RefreshToken[]>
  create(data: RefreshToken): Promise<RefreshToken>
  rotate(oldId: string, replacement: RefreshToken): Promise<boolean>
  update(tokenId: string, data: RefreshToken): Promise<RefreshToken>
  delete(tokenId: string): Promise<void>
};