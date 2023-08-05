import { ApiProperty } from "@nestjs/swagger";

export class ResponseLoginDto {
  @ApiProperty({
    description: "Jwt linked with account",
  })
  access_token: string;
}
