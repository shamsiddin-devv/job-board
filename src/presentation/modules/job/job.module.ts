import { Module } from "@nestjs/common";
import { JobController } from "./job.controller";


@Module({
  imports: [],
  controllers: [JobController],
  providers: []
})
export class JobModule {};