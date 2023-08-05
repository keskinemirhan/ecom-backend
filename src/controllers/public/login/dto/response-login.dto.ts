import { ApiProperty } from "@nestjs/swagger";

export class ResponseLoginDto {
  @ApiProperty({
    description: "Jwt linked with account",
  })
  access_token: string;

  @ApiProperty({
    description: "Indicates whether the account is verified or not",
  })
  verified: boolean;
}
