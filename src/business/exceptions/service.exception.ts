import { ErrorCode } from "src/controllers/dto/errors";

export abstract class ServiceException {
  message: string = "Unexpected error";
  parameter?: string;
  readonly code: ErrorCode;
  constructor(body?: { message?: string; parameter?: string }) {
    if (body.message) this.message = body.message;
    if (body.parameter) this.parameter = body.parameter;
  }
}
