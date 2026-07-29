import { Module } from "@nestjs/common";
import { RepositoriesModule } from "src/infrastructure/repositories.module";

@Module({
  imports: [RepositoriesModule],
  controllers: [],
  providers: []
})
export class ResumeModule {};