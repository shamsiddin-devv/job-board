import { User } from "../entities/User";
import { Email } from "../value-objects/Email";


export interface IUserRepository {
  findById(userId: string): Promise<User | void>
  findByEmail(email: Email): Promise<User>
  findAll(): Promise<User[]>
  save(data: User): Promise<User>
  remove(userId: string): Promise<void> 
};