import { ApiProperty } from "@nestjs/swagger";
import { ResponseCategoryDto } from "src/controllers/category/dto/response-category.dto";

export class ResponseUpdateCategoryDto {
  @ApiProperty({
    description: "Updated category",
    type: ResponseCategoryDto,
  })
  updated: ResponseCategoryDto;
}
