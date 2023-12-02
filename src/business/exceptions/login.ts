import { ServiceException } from "./service.exception";

export class LoginException extends ServiceException {
  type: string = "Login";
  message: string = "Login Exception";
}

export class NoLoginUserException extends LoginException {
  message = "Account does not exists";
}

export class IsNotAdminException extends LoginException {
  message = "User is not admin";
}

export class InvalidPasswordException extends LoginException {
  message = "Password is invalid";
}
