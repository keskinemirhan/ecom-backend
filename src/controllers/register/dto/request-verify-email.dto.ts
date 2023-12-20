import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsJWT, IsString } from "class-validator";

export class RequestVerifyEmailDto {
  @ApiProperty({
    description: "Verification code sent to email",
  })
  @IsString()
  code: string;

  @ApiProperty({
    description: "Jwt of account ",
  })
  @IsJWT()
  access_token: string;
}
