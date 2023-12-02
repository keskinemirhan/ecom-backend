import { ServiceException } from "./service.exception";

export class RegistrationException extends ServiceException {
  message: string = "Registration Error";

  type: string = "Registration";
}

export class EmailExistsException extends RegistrationException {
  message: string = "Email already exists";
  readonly code = "R001";
}

export class AlreadyVerifiedException extends RegistrationException {
  message: string = "Account already verified";
  readonly code = "R006";
}

export class QuotaExceededException extends RegistrationException {
  message: string = "Verification quota exceeded";
  readonly code = "R007";
}

export class NoVerificationException extends RegistrationException {
  message: string = "No email verification request has not been made";
  readonly code = "R002";
}
export class VerificationTimeoutException extends RegistrationException {
  message: string = "Verification timeout";
  readonly code = "R003";
}

export class InvalidVerificationException extends RegistrationException {
  message: string = "Invalid Verification";
  readonly code = "R004";
}
export class AlreadyFailedVerificationException extends RegistrationException {
  message: string = "Verification is failed already";
  readonly code = "R005";
}
