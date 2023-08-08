import { ApiProperty } from "@nestjs/swagger";

export class ResponseCategoryDto {
  @ApiProperty({
    description: "Id of category",
  })
  id: string;

  @ApiProperty({
    description: "Name of the category",
  })
  name: string;
}
