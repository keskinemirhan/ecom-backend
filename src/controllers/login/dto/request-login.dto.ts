import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class RequestLoginDto {
  @ApiProperty({
    description: "Email of account ",
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "Password of account",
  })
  @IsString()
  password: string;
}
