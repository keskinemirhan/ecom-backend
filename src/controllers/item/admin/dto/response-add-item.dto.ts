import { ApiProperty } from "@nestjs/swagger";
import { ResponseItemDto } from "src/controllers/item/dto/response-item.dto";

export class ResponseAddItemDto {
  @ApiProperty({
    description: "Created Item",
    type: ResponseItemDto,
  })
  created: ResponseItemDto;
}
