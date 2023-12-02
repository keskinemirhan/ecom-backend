export const SERVICE_ERRORS = [
  "USER_NOT_FOUND",
  "ADDRESS_NOT_FOUND",
  "ITEM_NOT_FOUND",
  "BASKET_LIMIT_EXCEEDED",
  "INSUFFICIENT_STOCK",
  "BASKET_ITEM_NOT_FOUND",
  "CATEGORY_NOT_FOUND",
  "EMPTY_FILE_GIVEN",
  "FILE_NOT_FOUND",
  "INVALID_CREDENTIALS",
  "ORDER_NOT_FOUND",
  "EMAIL_ALREADY_EXISTS",
  "VERIFICATION_QUOTA_EXCEEDED",
  "ALREADY_VERIFIED",
  "INVALID_VERIFICATION_CODE",
  "NO_VERIFICATION_IN_PROCESS",
  "ALREADY_FAILED_VERIFICATION",
  "VERIFICATION_TIMEOUT",
] as const;
export type ServiceError = (typeof SERVICE_ERRORS)[number];

export class BaseException<T extends string> {
  message: string;
  info: any;
  code: T;
  constructor(code: T, message?: string, info?: any) {
    this.code = code;
    if (message) this.message = message;
    if (info) this.info = info;
  }
}
export class ServiceException extends BaseException<ServiceError> {}
