import { OmitType, PartialType } from "@nestjs/mapped-types";
import { PostJobDto } from "./PostJobDto";

export class UpdateJobDto extends PartialType(
  OmitType(PostJobDto, ['postType'] as const)
) {};