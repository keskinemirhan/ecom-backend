import { ApiProperty } from "@nestjs/swagger";

export class ResponseEmailVerfication {
  @ApiProperty({
    description: "Email that received verification mail",
  })
  email: string;
}
