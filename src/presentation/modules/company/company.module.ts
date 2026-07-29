import { Module } from "@nestjs/common";
import { CompanyController } from "./company.controller";
import { RepositoriesModule } from "src/infrastructure/repositories.module";

@Module({
  imports: [RepositoriesModule],
  controllers: [CompanyController],
  providers: []
})
export class CompanyModule {};