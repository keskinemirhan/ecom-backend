import { ApiProperty } from "@nestjs/swagger";
import { ResponseCategoryDto } from "./response-category.dto";

export class ResponseAllCategoriesDto {
  @ApiProperty({
    description: "Array of categories",
    isArray: true,
    type: ResponseCategoryDto,
  })
  categories: ResponseCategoryDto[];
}
