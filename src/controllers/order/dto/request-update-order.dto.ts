import { IsBoolean, IsOptional } from "class-validator";
import { IsNotBlank } from "src/business/validators/is-not-blank.validator";

export class RequestUpdateOrderDto {
  @IsOptional()
  @IsNotBlank(4, 30)
  status?: string;

  @IsOptional()
  @IsBoolean()
  isPaid?: boolean;

  @IsOptional()
  @IsBoolean()
  isDelivered?: boolean;

  @IsOptional()
  @IsBoolean()
  isCanceled?: boolean;

  @IsOptional()
  @IsBoolean()
  isRequested?: boolean;

  @IsOptional()
  @IsBoolean()
  isFailed?: boolean;
}
