import { ErrorCode } from "src/controllers/dto/errors";

export class ServiceException {
  message: string = "Unexpected error";
  type: string;
  parameter?: string;
  code: ErrorCode;
  constructor(body?: { message?: string; parameter?: string }) {
    if (body.message) this.message = body.message;
    if (body.parameter) this.parameter = body.parameter;
  }
}
