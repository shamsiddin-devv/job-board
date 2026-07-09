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
    const rows = await this.prismaService.user.findMany();
    return rows.map((row) => this.toDomain(row));
  };

  async findByEmail(email: Email): Promise<User | null> {
    const row = await this.prismaService.user.findUnique({where: {email: email.toString()}});
    if(!row) return null
    return this.toDomain(row);
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

  toDomain(row: any): User {
    return new User({
      id: row.id,
      email: new Email(row.email),
      name: row.name,
      phone: row.phone ?? undefined,
      role: row.role.toLowerCase() as any,
      avatarUrl: row.avatarUrl ?? undefined,
      isVerified: row.isVerified,
      isActive: row.isActive,
      createdAt: row.createdAt,
    }); 
  }

  toPersistence(user: User, passwordHash: string): any {
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
