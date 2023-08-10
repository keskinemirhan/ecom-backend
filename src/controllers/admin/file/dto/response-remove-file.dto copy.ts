import { ApiProperty } from "@nestjs/swagger";
import { ResponseFileDto } from "./response-file.dto";

export class ResponseRemoveFileDto {
  @ApiProperty({
    description: "Removed file",
    type: ResponseFileDto,
  })
  removed: ResponseFileDto;
}
