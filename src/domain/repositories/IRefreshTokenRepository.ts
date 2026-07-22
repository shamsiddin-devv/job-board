import { RefreshToken } from "../entities/RefreshToken";

export interface IRefreshTokenRepository {
  findById(tokenId: string): Promise<RefreshToken | null>
  findByToken(token: string): Promise<RefreshToken | null>
  findByUserId(userId: string): Promise<RefreshToken | null>
  findAll(): Promise<RefreshToken[]>
  create(data: RefreshToken): Promise<RefreshToken>
  update(tokenId: string, data: RefreshToken): Promise<RefreshToken>
  remove(tokenId: string): Promise<void>
};