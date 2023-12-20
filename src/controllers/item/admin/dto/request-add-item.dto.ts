import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString, IsUUID, IsUrl } from "class-validator";

export class RequestAddItemDto {
  @ApiProperty({
    description: "Name of the item",
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: "Price of the item",
  })
  @IsNumber()
  price: number;

  @ApiProperty({
    description: "Description of the item",
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: "Image url of the item",
  })
  @IsUrl()
  imageUrl: string;

  @ApiProperty({
    description: "Stock quantity of the item",
  })
  @IsNumber()
  quantity: number;

  @ApiProperty({
    description: "Category id of the item",
  })
  @IsUUID()
  categoryId: string;
}
