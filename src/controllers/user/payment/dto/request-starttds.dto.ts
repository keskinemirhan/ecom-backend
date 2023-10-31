import { ApiProperty } from "@nestjs/swagger";
import { IsNumberString, IsUUID } from "class-validator";
import { IsNotBlank } from "src/business/validators/is-not-blank.validator";

export class RequestStartTdsDto {
  @ApiProperty({
    description: "Card number",
  })
  @IsNotBlank(16, 19)
  @IsNumberString()
  cardNumber: string;

  @ApiProperty({
    description: "Expire year of the card",
  })
  @IsNotBlank(4, 4)
  @IsNumberString()
  expireYear: string;

  @ApiProperty({
    description: "Expire month of the card",
  })
  @IsNotBlank(1, 2)
  @IsNumberString()
  expireMonth: string;

  @ApiProperty({
    description: "CVC of the card",
  })
  @IsNotBlank(1, 30)
  @IsNumberString()
  cvc: string;
  @ApiProperty({
    description: "Count of item to be added to basket",
  })
  @IsNotBlank(1, 250)
  cardHolderName: string;

  @ApiProperty({
    description: "Count of item to be added to basket",
  })
  @IsNotBlank(11, 11)
  @IsNumberString()
  identityNumber: string;

  @ApiProperty({
    description: "Count of item to be added to basket",
  })
  @IsUUID()
  shippingAddressId: string;
}
