import { IsNumber, IsUUID, Max, Min } from "class-validator";

export class RequestBasketItemDto {
  @IsUUID()
  itemId: string;

  @IsNumber()
  @Max(500)
  @Min(1)
  quantity: number;
}
