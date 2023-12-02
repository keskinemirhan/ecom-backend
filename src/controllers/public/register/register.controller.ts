import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
} from "@nestjs/common";
import { RegistrationService } from "src/business/services/registration.service";
import { RequestRegisterDto } from "./dto/request-register.dto";
import { UtilityService } from "src/business/services/utility.service";
import { ResponseRegisterDto } from "./dto/response-register.dto";
import { JwtService } from "@nestjs/jwt";
import { RequestVerifyEmailDto } from "./dto/request-verify-email.dto";
import { ResponseVerifyEmailDto } from "./dto/response-verify-email.dto";
import { RequestEmailVerificationDto } from "./dto/request-email-verification.dto";
import { ResponseEmailVerficationDto } from "./dto/response-email-verificaiton.dto";
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { ResponseErrorDto } from "src/controllers/dto/response-error.dto";
import { customError, errorApiInfo } from "src/controllers/dto/errors";
@ApiTags("Register")
@Controller("register")
export class RegisterController {
  constructor(
    private registrationService: RegistrationService,
    private utilityService: UtilityService,
    private jwtService: JwtService
  ) {}

  @ApiOkResponse({
    description:
      "Returns email and Jwt , sends verification email with code to registered email address",
    type: ResponseRegisterDto,
  })
  @ApiBadRequestResponse(errorApiInfo(["EMAIL_ALREADY_EXISTS"]))
  @Post()
  async register(
    @Body() requestRegister: RequestRegisterDto
  ): Promise<ResponseRegisterDto> {
    const registerResult = await this.registrationService.registerUser(
      requestRegister
    );

    const email = requestRegister.email;
    const name = requestRegister.name;

    const code = this.utilityService.createVerificationCode();
    await this.registrationService.createEmailVerification(email, code);
    await this.registrationService.sendEmailVerification(email, name, code);
    const payload = {
      sub: registerResult.id,
      email: registerResult.email,
      name: registerResult.name,
    };
    const access_token = await this.jwtService.signAsync(payload);
    return {
      email,
      access_token,
    };
  }

  @ApiOkResponse({
    description: "Returns success as true",
    type: ResponseVerifyEmailDto,
  })
  @ApiBadRequestResponse(
    errorApiInfo([
      "VERIFICATION_TIMEOUT",
      "ALREADY_FAILED_VERIFICATION",
      "INVALID_VERIFICATION_CODE",
      "NO_VERIFICATION_IN_PROCESS",
    ])
  )
  @Post("email-verification")
  async verifyEmail(
    @Body() requestVerifyEmail: RequestVerifyEmailDto
  ): Promise<ResponseVerifyEmailDto> {
    const { code, access_token } = requestVerifyEmail;

    const payload = await this.jwtService.verifyAsync(access_token, {
      secret: process.env["JWT_SECRET"] || "secret",
    });
    const verificationResult =
      await this.registrationService.verifyEmailVerification(
        payload["email"],
        code
      );
    return {
      success: true,
    };
  }

  @ApiOkResponse({
    description:
      "Returns email and sends verification email to access token's email address ",
    type: ResponseEmailVerficationDto,
  })
  @ApiBadRequestResponse(
    errorApiInfo([
      "INVALID_TOKEN",
      "VERIFICATION_QUOTA_EXCEEDED",
      "ALREADY_VERIFIED",
    ])
  )
  @Get("email-verification")
  async requestEmailVerification(
    @Body() requestEmailVerification: RequestEmailVerificationDto
  ): Promise<ResponseEmailVerficationDto> {
    const { access_token } = requestEmailVerification;
    let payload;
    try {
      payload = await this.jwtService.verifyAsync(access_token, {
        secret: process.env["JWT_SECRET"] || "secret",
      });
    } catch {
      throw new BadRequestException(customError("INVALID_TOKEN"));
    }
    const email = payload["email"] as string;
    const name = payload["name"] as string;
    const code = this.utilityService.createVerificationCode();
    const result = await this.registrationService.createEmailVerification(
      email,
      code
    );
    await this.registrationService.sendEmailVerification(email, name, code);

    return {
      email,
    };
  }
}
