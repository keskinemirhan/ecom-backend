import { ServiceException } from "./service.exception";

export class AddressException extends ServiceException {
  message = "Address exception";
}
export class AddressNotFoundException extends AddressException {
  message = "Address not found";
  readonly code = "AD001";
}
