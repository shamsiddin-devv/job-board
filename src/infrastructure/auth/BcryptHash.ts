import bcrypt from 'bcrypt';
import { IHashRepository } from 'src/domain/repositories/IHashRepository';

export class BcryptHash implements IHashRepository {
  private readonly SALT_ROUNDS = process.env.SALT_ROUNDS!;

  async hash(plainText: string): Promise<string> {
    return bcrypt.hash(plainText, this.SALT_ROUNDS);
  }

  async compare(plainText: string, hashedText: string): Promise<boolean> {
    return bcrypt.compare(plainText, hashedText);
  }
}
