import { Module } from "@nestjs/common";
import { SavedJobController } from "./saved-job.controller";

@Module({
  imports: [],
  controllers: [SavedJobController],
  providers: []
})
export class SavedJobModule {};