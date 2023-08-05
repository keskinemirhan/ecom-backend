import { ApiProperty } from "@nestjs/swagger";
import { IsJWT } from "class-validator";

export class RequestEmailVerificationDto {
  @ApiProperty({ description: "Jwt of account of requested email" })
  @IsJWT()
  access_token: string;
}
