import { Order } from "../entities/order.entity";
import { ServiceException } from "./service.exception";

export class OrderException extends ServiceException {
  message = "Order error";
}

export class OrderNotFoundException extends Order {
  message = "Order not found";
}
