import { BaseException } from "./service.exception";

export const AUTH_ERRORS = ["LOGIN_REQUIRED", "INVALID_TOKEN"] as const;
export type AuthError = (typeof AUTH_ERRORS)[number];

export class AuthException extends BaseException<AuthError> {}
