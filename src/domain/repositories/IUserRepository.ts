import { User } from "../entities/User";
import { Email } from "../value-objects/Email";


export interface IUserRepository {
  findById(uuid: string): Promise<User | void>
  findByEmail(email: Email): Promise<User>
  findAll(): Promise<User[]>
  save(user: User): Promise<User>
  delete(uuid: string): Promise<void> 
};