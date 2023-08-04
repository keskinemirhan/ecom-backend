import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Transporter, createTransport } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

interface MailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class MailService {
  private transporter: Transporter<SMTPTransport.SentMessageInfo>;

  constructor(private configService: ConfigService) {}

  /**
   * Creates transporter and passes it to transporter property
   */
  private async createConnection() {
    const host = this.configService.get<string>("SMTP_HOST");
    const port = Number(this.configService.get<string>("SMTP_PORT"));
    const secure =
      this.configService.get<string>("SMTP_TLS") === "true" ? true : false;
    const user = this.configService.get<string>("SMTP_USERNAME");
    const pass = this.configService.get<string>("SMTP_PASSWORD");

    this.transporter = createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
    });
  }

  /**
   * Sends mail with specified mail options
   * @param mailOptions - specifies mail content
   */
  async sendMail(mailOptions: MailOptions) {
    await this.createConnection();
    await this.transporter.sendMail({
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject,
      html: mailOptions.html,
    });
  }
}
