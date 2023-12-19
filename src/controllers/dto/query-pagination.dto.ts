import { Type } from "class-transformer";
import { IsInt, Max, Min } from "class-validator";

export class QueryPagination {
  @IsInt()
  @Max(1000)
  @Min(1)
  @Type(() => Number)
  take: number;

  @IsInt()
  @Max(1000)
  @Min(1)
  @Type(() => Number)
  page: number;
}
