import { ServiceException } from "./service.exception";

export class BasketException extends ServiceException {
  message = "Basket error";
}
export class BasketLimitExceededException extends BasketException {
  message = "Basket count limit exceeded";
  readonly code = "B002";
}

export class NotEnoughStockException extends BasketException {
  message = "Not enough stock";
  readonly code = "B003";
}

export class BasketItemNotFoundException extends BasketException {
  message = "Basket item not found";
  readonly code = "B001";
}
