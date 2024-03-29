import { ApiProperty } from "@nestjs/swagger";
import { ResponseItemDto } from "src/controllers/item/dto/response-item.dto";

export class ResponseUpdateItemDto {
  @ApiProperty({
    description: "Updated Item",
    type: ResponseItemDto,
  })
  updated: ResponseItemDto;
}
