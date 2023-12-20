import { ApiProperty } from "@nestjs/swagger";
import { ResponseFileDto } from "./response-file.dto";

export class ResponseUploadFileDto {
  @ApiProperty({
    description: "Uploaded file",
    type: ResponseFileDto,
  })
  uploaded: ResponseFileDto;
}
