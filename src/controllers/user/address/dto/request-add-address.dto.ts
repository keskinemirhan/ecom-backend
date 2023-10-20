import { ApiProperty } from "@nestjs/swagger";
import { IsPostalCode } from "class-validator";
import { IsNotBlank } from "src/business/validators/is-not-blank.validator";

export class RequestAddAddressDto {
  @IsPostalCode("any")
  @ApiProperty({
    required: true,
    description: "Zip code",
  })
  zipCode: string;

  @ApiProperty({
    required: true,
    description: "Contact name of the address",
  })
  @IsNotBlank(1, 250)
  contactName: string;

  @ApiProperty({
    required: true,
    description: "Contact surname of the address",
  })
  @IsNotBlank(1, 250)
  contactSurname: string;

  @ApiProperty({
    required: true,
    description: "City of the address",
  })
  @IsNotBlank(1, 120)
  city: string;

  @ApiProperty({
    required: true,
    description: "Country of the address",
  })
  @IsNotBlank(1, 120)
  country: string;

  @ApiProperty({
    required: true,
    description: "Description of the address",
  })
  @IsNotBlank(1, 400)
  address: string;
}
