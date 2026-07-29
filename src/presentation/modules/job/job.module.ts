import { Module } from "@nestjs/common";
import { JobController } from "./job.controller";
import { RepositoriesModule } from "src/infrastructure/repositories.module";


@Module({
  imports: [RepositoriesModule],
  controllers: [JobController],
  providers: []
})
export class JobModule {};