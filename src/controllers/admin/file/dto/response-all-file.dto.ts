import { ApiProperty } from "@nestjs/swagger";
import { ResponseFileDto } from "./response-file.dto";

export class ResponseAllFileDto {
  @ApiProperty({
    description: "Item Array",
    type: ResponseFileDto,
    isArray: true,
  })
  data: ResponseAllFileDto[];

  @ApiProperty({
    description: "Count of files",
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
