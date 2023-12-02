import { ApiProperty } from "@nestjs/swagger";
import { AuthError } from "src/business/exceptions/auth.exception";
import { ServiceError } from "src/business/exceptions/service.exception";
import { ControllerError } from "../exception/controller";

export class ResponseErrorDto {
  @ApiProperty({
    description: "Error Code ",
    example: "USER_NOT_FOUND",
  })
  errorCode: AuthError | ServiceError | ControllerError;

  @ApiProperty({
    description: "Error Description",
    example: "Email already in use",
  })
  error: string;
}
