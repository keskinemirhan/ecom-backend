import { ApiProperty } from "@nestjs/swagger";
import { ResponseCategoryDto } from "src/controllers/public/category/dto/response-category.dto";

export class ResponseRemoveCategoryDto {
  @ApiProperty({
    description: "Removed category",
    type: ResponseCategoryDto,
  })
  removed: ResponseCategoryDto;
}
