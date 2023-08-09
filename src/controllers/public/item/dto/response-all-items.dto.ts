import { ApiProperty } from "@nestjs/swagger";
import { ResponseItemDto } from "./response-item.dto";

export class ResponseAllItemsDto {
  @ApiProperty({
    description: "Item Array",
    type: ResponseItemDto,
    isArray: true,
  })
  data: ResponseItemDto[];

  @ApiProperty({
    description: "Count of items",
  })
  count: number;

  @ApiProperty({
    description: "Current page number",
  })
  currentPage: number;

  @ApiProperty({
    description: "Page number of next page if no next page null",
  })
  nextPage: number | null;

  @ApiProperty({
    description: "Page number of previous page if no previous page null",
  })
  prevPage: number | null;

  @ApiProperty({
    description: "Page number of last page",
  })
  lastPage: number;
}
