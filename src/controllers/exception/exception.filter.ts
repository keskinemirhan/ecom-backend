import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { AuthException } from "src/business/exceptions/auth.exception";
import { ServiceException } from "src/business/exceptions/service.exception";
import { ControllerException } from "./controller";
import { Response } from "express";
import { customError } from "../dto/errors";

@Catch(ServiceException, AuthException, ControllerException)
export class MainExceptionFilter implements ExceptionFilter {
  catch(
    exception: ServiceException | AuthException | ControllerException,
    host: ArgumentsHost
  ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    response.status(400).json(customError(exception.code));
  }
}
