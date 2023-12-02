import { ServiceException } from "./service.exception";

export class ItemException extends ServiceException {
  type: string = "Item";
  message: string = "Item Exception";
}

export class ItemNotFoundException extends ItemException {
  message = "Item not found";
}
