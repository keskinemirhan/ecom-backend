import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
} from "class-validator";
import { IsNotBlank } from "src/business/validators/is-not-blank.validator";

export class RequestRegisterDto {
  @ApiProperty({
    description: "Name of the user max 1 min 120",
  })
  @IsNotBlank(1, 120)
  name: string;

  @ApiProperty({
    description: "Surname of the user max 1 min 120",
  })
  @IsNotBlank(1, 120)
  surname: string;

  @ApiProperty({
    description: "Email of the user",
  })
  @IsEmail()
  email: string;

  @ApiProperty({ description: "Phone number of the user " })
  @IsPhoneNumber()
  phoneNumber: string;

  @ApiProperty({
    description: "Password of the user",
  })
  @IsString()
  password: string;
}
