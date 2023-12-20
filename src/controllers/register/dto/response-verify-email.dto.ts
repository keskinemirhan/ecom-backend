import { ApiProperty } from "@nestjs/swagger";

export class ResponseVerifyEmailDto {
  @ApiProperty({
    description: "Indicates success",
  })
  success: true;
}
