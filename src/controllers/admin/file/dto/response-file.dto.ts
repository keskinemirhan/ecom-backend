import { ApiProperty } from "@nestjs/swagger";

export class ResponseFileDto {
  @ApiProperty({
    description: "Id of file object",
  })
  id: string;

  @ApiProperty({
    description: "Name of file ",
  })
  name: string;

  @ApiProperty({
    description: "Public url of the file ",
  })
  url: string;
}
