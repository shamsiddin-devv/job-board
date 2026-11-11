import { Injectable } from "@nestjs/common";
import { IRefreshTokenRepository } from "src/domain/repositories/IRefreshTokenRepository";
import { PrismaService } from "../prisma/prisma.service";
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
    return userToken ? this.toDomain(userToken) : null;
  };

  async updateManyByUserId(userId: string, isRevoked: boolean): Promise<void | null> {
    const user = await this.prismaService.user.findUnique({where: {id: userId}});
    if(!user) return null;
    await this.prismaService.refreshToken.updateMany({where: {userId}, data: {isRevoked}})
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

  async rotate(oldId: string, replacement: RefreshToken): Promise<boolean> {
    return this.prismaService.$transaction(async (tx) => {
      const { count } = await tx.refreshToken.updateMany({
        where: { id: oldId, isRevoked: false, expiresAt: { gt: new Date() } },
        data: { isRevoked: true },
      });
      if (count !== 1) return false;
      await tx.refreshToken.create({ data: this.toPersistence(replacement) });
      return true;
    });
  }

  async update(tokenId: string, data: RefreshToken): Promise<RefreshToken> {
    const row = await this.prismaService.refreshToken.update({
      where: {id: tokenId},
      data: this.toPersistence(data),
    });
    return this.toDomain(row);
  };
  
  async delete(tokenId: string): Promise<void> {
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