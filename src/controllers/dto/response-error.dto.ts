import { ApiProperty } from "@nestjs/swagger";
import { ErrorCode } from "./errors";

export class ResponseErrorDto {
  @ApiProperty({
    description: "Error Code ",
    example: "R001",
  })
  errorCode: ErrorCode;

  @ApiProperty({
    description: "Error Description",
    example: "Email already in use",
  })
  error: string;
}
