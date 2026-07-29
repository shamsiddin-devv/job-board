import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { RepositoriesModule } from "src/infrastructure/repositories.module";

@Module({
  imports: [RepositoriesModule],
  controllers: [AuthController],
  providers: [],
  exports: [],
})
export class AuthModule {};