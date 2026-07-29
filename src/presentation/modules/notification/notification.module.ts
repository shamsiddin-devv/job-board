import { Module } from "@nestjs/common";
import { NotificationController } from "./notification.controller";
import { RepositoriesModule } from "src/infrastructure/repositories.module";

@Module({
  imports: [RepositoriesModule],
  controllers: [NotificationController],
  providers: []
})
export class NotificationModule {}