import { ApiProperty } from "@nestjs/swagger";
import { ResponseCategoryDto } from "../../category/dto/response-category.dto";

export class ResponseItemDto {
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

  @ApiProperty({
    description: "Category of item",
  })
  category: ResponseCategoryDto;
}
