import { ApiProperty } from "@nestjs/swagger";

export class ResponseLogadminDto {
  @ApiProperty({
    description: "Access token of admin",
  })
  access_token: string;
}
