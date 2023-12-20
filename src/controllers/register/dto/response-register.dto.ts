import { ApiProperty } from "@nestjs/swagger";

export class ResponseRegisterDto {
  @ApiProperty({
    description: "Email of registered account",
  })
  email: string;

  @ApiProperty({
    description: "Jwt of registered account",
  })
  access_token: string;
}
