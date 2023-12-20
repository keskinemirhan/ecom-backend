import { ApiProperty } from "@nestjs/swagger";

export class ResponseLogadminDto {
  @ApiProperty({
    description: "Access token of admin",
  })
  access_token: string;

  @ApiProperty({
    description: "Refresh token",
  })
  refresh_token: string;
}
