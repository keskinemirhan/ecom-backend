import { ServiceException } from "./service.exception";

export class RegistrationException extends ServiceException {
  message: string = "Registration Error";
  type: string = "Registration";
}

export class EmailExistsException extends RegistrationException {
  message: string = "Email already exists";
}

export class AlreadyVerifiedException extends RegistrationException {
  message: string = "Account already verified";
}

export class QuotaExceededException extends RegistrationException {
  message: string = "Verification quota exceeded";
}

export class NoVerificationException extends RegistrationException {
  message: string = "No email verification request has not been made";
}
export class VerificationTimeoutException extends RegistrationException {
  message: string = "Verification timeout";
}

export class InvalidVerificationException extends RegistrationException {
  message: string = "Invalid Verification";
}
export class AlreadyFailedVerificationException extends RegistrationException {
  message: string = "Verification is failed already";
}
