import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class RequestUpdateCategoryDto {
  @ApiProperty({
    description: "Name of category",
  })
  @IsString()
  name: string;
}
