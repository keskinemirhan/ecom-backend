import { ApiProperty } from "@nestjs/swagger";

export class ResponseEmailVerficationDto {
  @ApiProperty({
    description: "Email that received verification mail",
  })
  email: string;
}
