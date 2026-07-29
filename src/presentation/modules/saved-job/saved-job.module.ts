import { Module } from "@nestjs/common";
import { SavedJobController } from "./saved-job.controller";
import { RepositoriesModule } from "src/infrastructure/repositories.module";

@Module({
  imports: [RepositoriesModule],
  controllers: [SavedJobController],
  providers: []
})
export class SavedJobModule {};