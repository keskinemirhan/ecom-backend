import { ServiceException } from "./service.exception";

export class BasketException extends ServiceException {
  message = "Basket error";
}
export class BasketLimitExceededException extends BasketException {
  message = "Basket count limit exceeded";
}

export class NotEnoughStockException extends BasketException {
  message = "Not enough stock";
}

export class BasketItemNotFoundException extends BasketException {
  message = "Baslet item not found";
}
