import { ApiProperty } from "@nestjs/swagger";
import { ResponseItemDto } from "src/controllers/public/item/dto/response-item.dto";

export class ResponsePlainItemDto {
  @ApiProperty({
    description: "Id of item",
  })
  id: string;

  @ApiProperty({
    description: "Name of item",
  })
  name: string;

  @ApiProperty({
    description: "Price of item",
  })
  price: number;

  @ApiProperty({
    description: "Description of item",
  })
  description: string;

  @ApiProperty({
    description: "Image url of item",
  })
  imageUrl: string;

  @ApiProperty({
    description: "Stock quantity of item",
  })
  quantity: number;
}

export class ResponseBasketItemDto {
  @ApiProperty({
    description: "Id of basket item no redundant property",
  })
  id: string;

  @ApiProperty({
    description: "Count of item",
  })
  count: number;

  @ApiProperty({
    description: "Original item",
    type: ResponsePlainItemDto,
  })
  item: ResponsePlainItemDto;
}

export class ResponseBasketDto {
  @ApiProperty({
    description: "Basket items",
    isArray: true,
    type: ResponseBasketItemDto,
  })
  basket: ResponseBasketItemDto[];

  @ApiProperty({
    description: "Total item count",
  })
  totalCount: number;

  @ApiProperty({
    description: "Total price of the basket",
  })
  totalPrice: number;
}
