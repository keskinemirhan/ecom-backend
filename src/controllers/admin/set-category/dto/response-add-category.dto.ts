import { ApiProperty } from "@nestjs/swagger";
import { ResponseCategoryDto } from "src/controllers/public/category/dto/response-category.dto";

export class ResponseAddCategoryDto {
  @ApiProperty({
    description: "Created category",
    type: ResponseCategoryDto,
  })
  created: ResponseCategoryDto;
}
