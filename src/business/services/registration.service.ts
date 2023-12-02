import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../entities/user.entity";
import { DeepPartial, Repository } from "typeorm";
import { readFileSync } from "fs";
import Handlebars from "handlebars";
import { MailService } from "./mail.service";
import { ConfigService } from "@nestjs/config";
import { EmailVerification } from "../entities/email-verification.entity";
import { UtilityService } from "./utility.service";
import {
  AlreadyFailedVerificationException,
  AlreadyVerifiedException,
  EmailExistsException,
  InvalidVerificationException,
  NoVerificationException,
  QuotaExceededException,
  VerificationTimeoutException,
} from "../exceptions/registration";

@Injectable()
export class RegistrationService {
  private emailVTemplate: any;
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(EmailVerification)
    private verificationRepo: Repository<EmailVerification>,
    private mailService: MailService,
    private configService: ConfigService,
    private utilityService: UtilityService
  ) {
    // Get email verification template content from assets folder
    const emailVHbs = readFileSync(
      __dirname + "/../../../assets/email-verification.hbs",
      "utf-8"
    );
    // Compile handlebars content
    this.emailVTemplate = Handlebars.compile(emailVHbs);
  }

  /**
   * Registers user
   * @returns registered user
   * @param userModel - Partial user object email, is a neccessary field
   * @throws {EmailExistsException} if email already exists
   */
  async registerUser(userModel: DeepPartial<User>): Promise<User | undefined> {
    // Control if email is used already
    const controlEmail = await this.userRepo.findOne({
      where: {
        email: userModel.email,
      },
    });
    if (controlEmail) throw new EmailExistsException();

    // Hash password
    userModel.password = await this.utilityService.hashString(
      userModel.password
    );
    // Set account status unverified
    userModel.verified = false;

    // Create user and save it
    const user = this.userRepo.create(userModel);
    return this.userRepo.save(user);
  }

  /**
   * Creates EmailVerification entity on database that
   * correlates given email address with given code, if verification
   * creation quota exceeded for given email address then
   * does not create EmailVerification entity and throws exception, if
   * user already verified then throws exception
   *
   * @param email - Email address to associate with given verification code
   * @param code - Verification code to associate with given email address
   * @param quota - Email verification creation quota for given email address default value is 10
   * @throws {QuotaExceededException} if verification quota exceeded
   * @throws {AlreadyVerifiedException} if account already verified
   * @returns promise of EmailVerification if creation successful
   */
  async createEmailVerification(
    email: string,
    code: string,
    quota: number = 10
  ) {
    const user = await this.userRepo.findOne({
      where: {
        email,
      },
    });
    if (user.verified) throw new AlreadyVerifiedException();

    const prevVerification = await this.verificationRepo.findOne({
      where: { email },
    });
    let count = 0;
    if (prevVerification) {
      count = prevVerification.count + 1;
      await this.verificationRepo.remove(prevVerification);
    }
    if (count > quota) throw new QuotaExceededException();
    const verification = await this.verificationRepo.create({
      email,
      code,
      count,
      controlled: false,
    });
    return await this.verificationRepo.save(verification);
  }

  /**
   * Sends Email verification mail to specified email address
   * @param email - The email address that receives the email
   * @param name - Name of the receiver
   * @param code - Verification code
   *
   */
  async sendEmailVerification(emailAddr: string, name: string, code: string) {
    const fromEmail = this.configService.get<string>("SMTP_SENDER_EMAIL");
    const fromName = this.configService.get<string>("SMTP_SENDER_NAME");
    await this.mailService.sendMail({
      to: emailAddr,
      from: `"${fromName}" ${fromEmail}`,
      subject: "E-Posta Doğrulaması",
      html: this.emailVTemplate({ name: name, code: code }),
    });
  }

  /**
   * Controls verification code for given email
   * return conditional number values
   * @param email - Email address that associated with code
   * @param code - Code to be used to verify email
   * @throws {VerificationTimeoutException} if verification times is exceeded
   * @throws {AlreadyFailedVerificationException} if already failed
   * @throws {InvalidVerificationException} if invalid code is given
   * @throws {NoVerificationException} if no verification found
   */
  async verifyEmailVerification(email: string, code: string) {
    const verification = await this.verificationRepo.findOne({
      where: {
        email,
      },
    });
    if (!verification) throw new NoVerificationException();
    const currentDate = new Date();
    const verificationDate = verification.created_at;
    const differenceMin = this.utilityService.dateDifferenceMin(
      currentDate,
      verificationDate
    );
    if (differenceMin > 2) throw new VerificationTimeoutException();

    if (verification.controlled) throw new AlreadyFailedVerificationException();
    if (verification.code !== code) {
      verification.controlled = true;
      await this.verificationRepo.save(verification);
      throw new InvalidVerificationException();
    }

    const user = await this.userRepo.findOne({ where: { email } });
    user.verified = true;
    await this.userRepo.save(user);
    await this.verificationRepo.remove(verification);
  }
}
