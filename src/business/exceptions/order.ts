import { ServiceException } from "./service.exception";

export class OrderException extends ServiceException {
  message = "Order error";
}

export class OrderNotFoundException extends OrderException {
  message = "Order not found";
  readonly code = "P001";
}
