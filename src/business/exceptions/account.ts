import { ServiceException } from "./service.exception";

export class AccountException extends ServiceException {
  message: string = "Account Error";
}
export class UserNotFoundException extends AccountException {
  message = "User not found";
  readonly code = "AC001";
}
