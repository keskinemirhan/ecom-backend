import { ApiProperty } from "@nestjs/swagger";
import { IsJWT } from "class-validator";

export class RequestRefresh {
  @ApiProperty({
    description: "Refresh token",
  })
  @IsJWT()
  refresh_token: string;
}
