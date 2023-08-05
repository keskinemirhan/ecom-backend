import { ApiResponseOptions } from "@nestjs/swagger";
import { ResponseErrorDto } from "./response-error.dto";

export const ErrorCodeDescriptions = {
  R001: "Email already in use",
  R002: "No verification for email",
  R003: "Given verification time exceeded",
  R004: "Verification code does not match",
  R005: "Failed verification session please create another session ",
  R006: "Account already verified",
  R007: "Verification quota exceeded please try again later",
  R008: "Jwt is not valid",
  L001: "Credentials are wrong",
};
export type ErrorCode = keyof typeof ErrorCodeDescriptions;

/**
 * Creates error object to send
 * @param code - code of the error
 * @returns created error object
 */
export function customError(code: ErrorCode): ResponseErrorDto {
  return {
    errorCode: code,
    error: ErrorCodeDescriptions[code],
  };
}

/**
 * Creates description for given codes to use at documentation
 * @param codes - error codes
 * @returns string of list of error codes and their descriptions
 */
export function customErrorDescription(codes: ErrorCode[]): string {
  let description = "";
  for (const code of codes) {
    description += ` | ${code} - ${ErrorCodeDescriptions[code]} | `;
  }
  return description;
}
/**
 * Creates ApiResponseOptions object according to given codes
 * to use at swagger api documentation decorators for specify
 * which error codes that endpoint gives
 * @param codes - error codes the endpoint gives
 * @returns ApiResponseObject to use as parameter to swagger decorator
 */
export function errorApiInfo(codes: ErrorCode[]): ApiResponseOptions {
  const description = "Error codes : " + customErrorDescription(codes);
  return {
    type: ResponseErrorDto,
    description,
  };
}
