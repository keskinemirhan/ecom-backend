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
  L002: "User is not admin",
  A001: "Have to log in to use this endpoint ",
  A002: "Invalid token",
  AC001: "User does not exists",
  AC002: "Password is wrong",
  B001: "Item not found",
  B002: "Basket limit exceeded",
  B003: "Cannot add more than stock quantity",
  C001: "Category not found",
  I001: "Item not found",
  F001: "Empty file field",
  F002: "File with given id not found",
  Q001: "One or all of the query params are not number ",
  P001: "Basket is empty",
  AD001: "Address not found",
  P002: "Invalid order",
  MD0: "Invalid 3D Secure signature or verification",
  MD2: "Card holder or Issuer not registered to 3D Secure network",
  MD3: "Issuer is not registered to 3D secure network",
  MD4: "Verification is not possible, card holder chosen to register later on system",
  MD5: "Verification is not possbile",
  MD6: "3D Secure error",
  MD7: "System error",
  MD8: "Unknown card",
  MD9: "Unknown error",
  P003: "Order does not exist",
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
