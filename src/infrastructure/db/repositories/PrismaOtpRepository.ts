import { Injectable } from '@nestjs/common';
import { IOtpRepository } from 'src/domain/repositories/IOtpRepository';
import { PrismaService } from '../prisma.service';
import { OtpCode } from 'src/domain/entities/OtpCode';

@Injectable()
export class PrismaOtpRepository implements IOtpRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findById(otpId: string): Promise<OtpCode | null> {
    const otp = await this.prismaService.otpCode.findUnique({where: {id: otpId}});
    if(!otp) return null
    return this.toDomain(otp);
  };

  async findByUserId(userId: string): Promise<OtpCode[]> {
    const userOtp = await this.prismaService.otpCode.findMany({where: {userId}});
    return userOtp.map((otp) => this.toDomain(otp));
  }

  async findAll(): Promise<OtpCode[]> {
    const otpCodes = await this.prismaService.otpCode.findMany();
    return otpCodes.map((otpCode) => this.toDomain(otpCode));
  };

  async create(data: OtpCode): Promise<OtpCode> {
    const row = await this.prismaService.otpCode.create({
      data: this.toPersistence(data),
    });
    return this.toDomain(row);
  };

  async update(otpId: string, data: OtpCode): Promise<OtpCode> {
    const row = await this.prismaService.otpCode.update({
      where: {id: otpId},
      data: this.toPersistence(data)
    });
    return this.toDomain(row);
  };

  async remove(otpId: string): Promise<void> {
    await this.prismaService.otpCode.delete({where: {id: otpId}});
  };

  private toDomain(otp: any): OtpCode {
    return new OtpCode({
      id: otp.id,
      userId: otp.userId,
      code: otp.code,
      type: otp.type,
      isUsed: otp.isUsed,
      expiresAt: otp.expiresAt,
      createdAt: otp.createdAt,
    });
  }

  private toPersistence(otp: OtpCode): any {
    return {
      id: otp.id,
      userId: otp.userId,
      code: otp.code,
      type: otp.type,
      isUsed: otp.isUsed,
      expiresAt: otp.expiresAt,
      createdAt: otp.createdAt,
    };
  }
}
