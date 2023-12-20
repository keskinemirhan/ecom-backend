import { ApiProperty } from "@nestjs/swagger";
import { ResponseItemDto } from "src/controllers/item/dto/response-item.dto";

export class ResponseRemoveItemDto {
  @ApiProperty({
    description: "Removed Item",
    type: ResponseItemDto,
  })
  removed: ResponseItemDto;
}
