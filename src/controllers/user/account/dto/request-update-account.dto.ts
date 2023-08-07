import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsPhoneNumber, IsString } from "class-validator";
import { IsNotBlank } from "src/business/validators/is-not-blank.validator";

export class RequestUpdateAccountDto {
  @ApiProperty({
    required: false,
    description: "New name of the user",
  })
  @IsNotBlank(1, 120)
  @IsOptional()
  name?: string;

  @ApiProperty({
    required: false,
    description: "New surnamename of the user",
  })
  @IsNotBlank(1, 120)
  @IsOptional()
  surname?: string;

  // @ApiProperty({
  //   required: false,
  //   description: "New email of the user",
  // })
  // @IsOptional()
  // @IsEmail()
  // email?: string;

  @ApiProperty({
    required: false,
    description: "New phone number of the user",
  })
  @IsOptional()
  @IsPhoneNumber()
  phoneNumber?: string;

  @ApiProperty({
    required: false,
    description: "New password of the user",
  })
  @IsString()
  @IsOptional()
  password?: string;

  @ApiProperty({
    required: true,
    description: "Current password of the user",
  })
  @IsString()
  authPassword: string;
}
