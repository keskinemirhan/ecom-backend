import { ServiceException } from "./service.exception";

export class LoginException extends ServiceException {
  type: string = "Login";
  message: string = "Login Exception";
}

export class NoLoginUserException extends LoginException {
  message = "Account does not exists";
  readonly code = "L001";
}

export class IsNotAdminException extends LoginException {
  message = "User is not admin";
  readonly code = "L001";
}

export class InvalidPasswordException extends LoginException {
  message = "Password is invalid";
  readonly code = "L001";
}
