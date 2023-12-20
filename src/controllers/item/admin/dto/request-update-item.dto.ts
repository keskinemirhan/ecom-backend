import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString, IsUUID, IsUrl } from "class-validator";

export class RequestUpdateItemDto {
  @ApiProperty({
    description: "Name of the item",
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: "Price of the item",
    required: false,
  })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiProperty({
    description: "Description of the item",
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: "Image url of the item",
    required: false,
  })
  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @ApiProperty({
    description: "Stock quantity of the item",
    required: false,
  })
  @IsOptional()
  @IsNumber()
  quantity?: number;

  @ApiProperty({
    description: "Category id of the item",
    required: false,
  })
  @IsOptional()
  @IsUUID()
  categoryId?: string;
}
