import { User } from "../entities/User";

export interface IUserRepository {
  findById(userId: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  findAll(): Promise<User[]>
  findPasswordHashByUserId(userId: string): Promise<string | null>
  resetPassword(userId: string, previousHash: string, newHash: string): Promise<boolean>
  create(data: User, passwordHash?: string): Promise<User>
  update(userId: string, data: User): Promise<User>
  delete(userId: string): Promise<void> 
};