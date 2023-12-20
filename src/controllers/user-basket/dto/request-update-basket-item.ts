import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsUUID, Max, Min } from "class-validator";

export class RequestUpdateBasketItemDto {
  @ApiProperty({
    description: "Id of item to be added to basket",
  })
  @IsUUID()
  itemId: string;

  @ApiProperty({
    description: "Count of item to be added to basket",
  })
  @IsNumber()
  @Max(500)
  @Min(1)
  count: number;
}
