import { Injectable } from "@nestjs/common";
import { IRefreshTokenRepository } from "src/domain/repositories/IRefreshTokenRepository";
import { PrismaService } from "../prisma.service";
import { RefreshToken } from "src/domain/entities/RefreshToken";

@Injectable()
export class PrismaRefreshTokenRepository implements IRefreshTokenRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findById(tokenId: string): Promise<RefreshToken | null> {
    const refreshToken = await this.prismaService.refreshToken.findUnique({where: {id: tokenId}});
    if(!refreshToken) return null;
    return this.toDomain(refreshToken);
  };

  async findByUserId(userId: string): Promise<RefreshToken | null> {
    const userToken = await this.prismaService.refreshToken.findFirst({where: {userId}})
    return this.toDomain(userToken);
  };

  async findByToken(token: string): Promise<RefreshToken | null> {
    const existToken = await this.prismaService.refreshToken.findUnique({where: {token}});
    if(!existToken) return null;
    return this.toDomain(existToken)
  };

  async findAll(): Promise<RefreshToken[]> {
    const tokens = await this.prismaService.refreshToken.findMany()
    return tokens.map((userToken) => this.toDomain(userToken));
  }

  async create(data: RefreshToken): Promise<RefreshToken> {
    const row = await this.prismaService.refreshToken.create({
      data: this.toPersistence(data),
    });
    return this.toDomain(row);
  };

  async update(tokenId: string, data: RefreshToken): Promise<RefreshToken> {
    const row = await this.prismaService.refreshToken.update({
      where: {id: tokenId},
      data: this.toPersistence(data),
    });
    return this.toDomain(row);
  };
  
  async remove(tokenId: string): Promise<void> {
    await this.prismaService.refreshToken.delete({where: {id: tokenId}});
  };

  private toDomain(refreshToken: any): RefreshToken {
    return new RefreshToken({
      id: refreshToken.id,
      userId: refreshToken.userId,
      token: refreshToken.token,
      isRevoked: refreshToken.isRevoked,
      expiresAt: refreshToken.expiresAt,
      createdAt: refreshToken.createdAt
    })
  };

  private toPersistence(refreshToken: RefreshToken): any {
    return {
      id: refreshToken.id,
      userId: refreshToken.userId,
      token: refreshToken.token,
      isRevoked: refreshToken.isRevoked,
      expiresAt: refreshToken.expiresAt,
      createdAt: refreshToken.createdAt
    };
  };
};