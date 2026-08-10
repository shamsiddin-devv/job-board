import bcrypt from 'bcrypt';
import { IHashService } from 'src/domain/services/IHashService';

export class BcryptHash implements IHashService {
  private readonly SALT_ROUNDS = Number(process.env.SALT_ROUNDS) || 10;

  async hash(plainText: string): Promise<string> {
    return bcrypt.hash(plainText, this.SALT_ROUNDS);
  }

  async compare(plainText: string, hashedText: string): Promise<boolean> {
    return bcrypt.compare(plainText, hashedText);
  }
}
