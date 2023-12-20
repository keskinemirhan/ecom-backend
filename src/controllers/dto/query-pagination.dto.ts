import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, Max, Min } from "class-validator";

export class QueryPagination {
  @ApiProperty({
    description: "To specify how many items the specified page will contain",
  })
  @IsInt()
  @Max(1000)
  @Min(1)
  @Type(() => Number)
  take: number;

  @ApiProperty({
    description: "To specify page number of the page",
  })
  @IsInt()
  @Max(1000)
  @Min(1)
  @Type(() => Number)
  page: number;
}
