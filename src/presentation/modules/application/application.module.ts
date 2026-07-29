import { Module } from "@nestjs/common";
import { ApplicationController } from "./application.controller";
import { RepositoriesModule } from "src/infrastructure/repositories.module";


@Module({
  imports: [RepositoriesModule],
  controllers: [ApplicationController],
  providers: []
})
export class ApplicationModule {};