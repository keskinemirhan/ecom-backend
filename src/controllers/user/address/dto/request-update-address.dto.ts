import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsPostalCode } from "class-validator";
import { IsNotBlank } from "src/business/validators/is-not-blank.validator";

export class RequestUpdateAddressDto {
  @ApiProperty({
    required: false,
    description: "Zipcode of the address",
  })
  @IsOptional()
  @IsPostalCode("any")
  zipCode?: string;

  @ApiProperty({
    required: false,
    description: "Contact name of the address",
  })
  @IsOptional()
  @IsNotBlank(1, 250)
  contactName?: string;

  @ApiProperty({
    required: false,
    description: "Contact surname of the address",
  })
  @IsOptional()
  @IsNotBlank(1, 250)
  contactSurname?: string;

  @ApiProperty({
    required: false,
    description: "City of the address",
  })
  @IsOptional()
  @IsNotBlank(1, 120)
  city?: string;

  @ApiProperty({
    required: false,
    description: "Country of the address",
  })
  @IsOptional()
  @IsNotBlank(1, 120)
  country?: string;

  @ApiProperty({
    required: false,
    description: "Description of the address",
  })
  @IsOptional()
  @IsNotBlank(1, 400)
  address?: string;
}
