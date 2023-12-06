import { BaseException } from "src/business/exceptions/service.exception";

export const CONTROLLER_ERRORS = [
  "QUERY_PARAMS_NOT_NUMBER",
  "EMPTY_BASKET",
  "INVALID_ORDER",
  "MD0",
  "MD0",
  "MD2",
  "MD3",
  "MD4",
  "MD5",
  "MD6",
  "MD7",
  "MD8",
  "MD9",
  "PAGE_AND_TAKE_INVALID",
  "ACCOUNT_NOT_VERIFIED",
] as const;
export type ControllerError = (typeof CONTROLLER_ERRORS)[number];

export class ControllerException extends BaseException<ControllerError> {}
