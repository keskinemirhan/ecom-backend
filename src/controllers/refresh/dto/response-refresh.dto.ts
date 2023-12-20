import { ApiProperty } from "@nestjs/swagger";

export class ResponseRefresh {
  @ApiProperty({
    description: "Token to access resources",
  })
  access_token: string;

  @ApiProperty({
    description: "Token to acquire access token",
  })
  refresh_token: string;
}
