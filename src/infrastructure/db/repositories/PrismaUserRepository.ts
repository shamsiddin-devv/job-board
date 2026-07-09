import { Injectable } from '@nestjs/common';
import { IUserRepository } from 'src/domain/repositories/IUserRepository';
import { PrismaService } from '../prisma.service';
import { User } from 'src/domain/entities/User';
import { Email } from 'src/domain/value-objects/Email';

@Injectable()
export class PrimsaUserRepository implements IUserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findById(userId: string): Promise<User | null> {
    const user = await this.prismaService.user.findUnique({where: {id: userId}})
    if(!user) return null
    return this.toDomain(user);
  };

  async findAll(): Promise<User[]> {
    const users = await this.prismaService.user.findMany();
    return users.map((user) => this.toDomain(user));
  };

  async findByEmail(email: Email): Promise<User | null> {
    const user = await this.prismaService.user.findUnique({where: {email: email.toString()}});
    if(!user) return null
    return this.toDomain(user);
  };

  async save(user: User, passwordHash: string): Promise<User> {
    const row = await this.prismaService.user.upsert({
      where: {id: user.id ?? ''},
      update: this.toPersistence(user, passwordHash),
      create: this.toPersistence(user, passwordHash)
    })
    return this.toDomain(row);
  };

  async remove(userId: string): Promise<void> {
    await this.findById(userId);
    await this.prismaService.user.delete({where: {id: userId}});
  };

  private toDomain(user: any): User {
    return new User({
      id: user.id,
      email: new Email(user.email),
      name: user.name,
      phone: user.phone ?? undefined,
      role: user.role.toLowerCase() as any,
      avatarUrl: user.avatarUrl ?? undefined,
      isVerified: user.isVerified,
      isActive: user.isActive,
      createdAt: user.createdAt,
    }); 
  }

  private toPersistence(user: User, passwordHash: string): any {
    return {
      id: user.id,
      email: user.email.toString(),
      phone: user.phone,
      role: user.role.toUpperCase(),
      avatarUrl: user.avatarUrl,
      isVerified: user.isVerified,
      isActive: user.isActive,
      createdAt: user.createdAt,
      passwordHash
    };
  };
}
