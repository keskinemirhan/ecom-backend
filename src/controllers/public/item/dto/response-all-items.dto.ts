import { ApiProperty } from "@nestjs/swagger";
import { ResponseItemDto } from "./response-item.dto";

export class ResponseAllItemsDto {
  @ApiProperty({
    description: "All Items",
    type: ResponseItemDto,
    isArray: true,
  })
  items: ResponseItemDto[];
}
