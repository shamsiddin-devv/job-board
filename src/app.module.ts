import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './infrastructure/db/prisma.module';
  
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    })
  ],
  controllers: [],
  providers: [
    PrismaModule,
  ],
})
export class AppModule {}
