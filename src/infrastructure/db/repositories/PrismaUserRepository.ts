import { Injectable } from '@nestjs/common';
import { IUserRepository } from 'src/domain/repositories/IUserRepository';
import { PrismaService } from '../prisma/prisma.service';
import { User, type AuthProvider } from 'src/domain/entities/User';
import { Email } from 'src/domain/value-objects/Email';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findById(userId: string): Promise<User | null> {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });
    if (!user) return null;
    return this.toDomain(user);
  }

  async findAll(): Promise<User[]> {
    const users = await this.prismaService.user.findMany();
    return users.map((user) => this.toDomain(user));
  }

  async findByEmail(email: string): Promise<User | null> {
    const userEmail = await this.prismaService.user.findUnique({
      where: {email},
    });
    if (!userEmail) return null;
    return this.toDomain(userEmail);
  };

  async findPasswordHashByUserId(userId: string): Promise<string | null> {
    const userPassword = await this.prismaService.user.findUnique({where: {id: userId}});
    if(!userPassword) return null;
    return userPassword.passwordHash;
  };

  async resetPassword(userId: string, previousHash: string, newHash: string): Promise<boolean> {
    return this.prismaService.$transaction(async (tx) => {
      const { count } = await tx.user.updateMany({
        where: { id: userId, passwordHash: previousHash, isActive: true },
        data: { passwordHash: newHash },
      });
      if (count !== 1) return false;
      await tx.refreshToken.updateMany({ where: { userId }, data: { isRevoked: true } });
      return true;
    });
  }

  async create(data: User, passwordHash?: string): Promise<User> {
    const row = await this.prismaService.user.create({
      data: this.toPersistence(data, passwordHash),
    });
    return this.toDomain(row);
  }

  async update(userId: string, data: User): Promise<User> {
    const row = await this.prismaService.user.update({
      where: { id: userId },
      data: this.toPersistence(data),
    });
    return this.toDomain(row);
  }

  async delete(userId: string): Promise<void> {
    await this.prismaService.user.delete({ where: { id: userId } });
  }

  private toDomain(user: any): User {
    return new User({
      id: user.id,
      email: new Email(user.email),
      fullName: user.fullName,
      phone: user.phone ?? undefined,
      role: user.role.toLowerCase() as any,
      authProvider: user.authProvider.toLowerCase() as AuthProvider,
      avatarUrl: user.avatarUrl ?? undefined,
      isVerified: user.isVerified,
      isActive: user.isActive,
      createdAt: user.createdAt,
    });
  }

  private toPersistence(user: User, passwordHash?: string): any {
    return {
      id: user.id,
      email: user.email.toString(),
      fullName: user.fullName,
      phone: user.phone,
      role: user.role.toUpperCase(),
      authProvider: user.authProvider.toUpperCase(),
      avatarUrl: user.avatarUrl,
      isVerified: user.isVerified,
      isActive: user.isActive,
      createdAt: user.createdAt,
      passwordHash,
    };
  }
}
