import { User } from "../entities/User";
import { Email } from "../value-objects/Email";


export interface IUserRepository {
  findById(userId: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  findAll(): Promise<User[]>
  findPasswordHashByUserId(userId: string): Promise<string | null>
  create(data: User, passwordHash?: string): Promise<User>
  update(userId: string, data: User): Promise<User>
  remove(userId: string): Promise<void> 
};