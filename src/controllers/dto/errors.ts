import { ApiResponseOptions } from "@nestjs/swagger";
import { ResponseErrorDto } from "./response-error.dto";
import { ServiceError } from "src/business/exceptions/service.exception";
import { AuthError } from "src/business/exceptions/auth.exception";
import { ControllerError } from "../exception/controller";

export const ErrorCodeDescriptions: {
  [K in AuthError | ServiceError | ControllerError]: string;
} = {
  EMAIL_ALREADY_EXISTS: "Email already in use",
  NO_VERIFICATION_IN_PROCESS: "No verification for email",
  VERIFICATION_TIMEOUT: "Given verification time exceeded",
  INVALID_VERIFICATION_CODE: "Verification code does not match",
  ALREADY_FAILED_VERIFICATION:
    "Failed verification session please create another session ",
  ALREADY_VERIFIED: "Account already verified",
  VERIFICATION_QUOTA_EXCEEDED:
    "Verification quota exceeded please try again later",
  INVALID_TOKEN: "Token is not valid",
  INVALID_CREDENTIALS: "Credentials are invalid",
  LOGIN_REQUIRED: "Have to log in to use this endpoint ",
  USER_NOT_FOUND: "User does not exists",
  BASKET_ITEM_NOT_FOUND: "Item not found",
  BASKET_LIMIT_EXCEEDED: "Basket limit exceeded",
  INSUFFICIENT_STOCK: "Cannot add more than stock quantity",
  CATEGORY_NOT_FOUND: "Category not found",
  ITEM_NOT_FOUND: "Item not found",
  EMPTY_FILE_GIVEN: "Empty file field",
  FILE_NOT_FOUND: "File with given id not found",
  QUERY_PARAMS_NOT_NUMBER: "One or all of the query params are not number ",
  EMPTY_BASKET: "Basket is empty",
  ADDRESS_NOT_FOUND: "Address not found",
  INVALID_ORDER: "Invalid order",
  MD0: "Invalid 3D Secure signature or verification",
  MD2: "Card holder or Issuer not registered to 3D Secure network",
  MD3: "Issuer is not registered to 3D secure network",
  MD4: "Verification is not possible, card holder chosen to register later on system",
  MD5: "Verification is not possbile",
  MD6: "3D Secure error",
  MD7: "System error",
  MD8: "Unknown card",
  MD9: "Unknown error",
  ORDER_NOT_FOUND: "Order does not exist",
  PAGE_AND_TAKE_INVALID:
    "Take and page numbers must be greater than 1 and should be integers",
  ACCOUNT_NOT_VERIFIED: "Account is not verified",
};
export type ErrorCode = keyof typeof ErrorCodeDescriptions;

/**
 * Creates error object to send
 * @param code - code of the error
 * @returns created error object
 */
export function customError(
  code: ServiceError | AuthError | ErrorCode
): ResponseErrorDto {
  return {
    errorCode: code,
    error: ErrorCodeDescriptions[code] || " ",
  };
}

/**
 * Creates description for given codes to use at documentation
 * @param codes - error codes
 * @returns string of list of error codes and their descriptions
 */
export function customErrorDescription(
  codes: ServiceError[] | AuthError[] | ErrorCode[]
): string {
  let description = "";
  for (const code of codes) {
    description += ` | ${code} - ${ErrorCodeDescriptions[code] || " "} | `;
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
export function errorApiInfo(
  codes: ServiceError[] | AuthError[] | ErrorCode[]
): ApiResponseOptions {
  const description = "Error codes : " + customErrorDescription(codes);
  return {
    type: ResponseErrorDto,
    description,
  };
}
