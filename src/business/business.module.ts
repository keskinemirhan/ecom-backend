import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Address } from "./entities/address.entity";
import { Category } from "./entities/category.entity";
import { CommercialItem } from "./entities/commercial-item.entity";
import { Order } from "./entities/order.entity";
import { User } from "./entities/user.entity";
import { RegistrationService } from "./services/registration.service";
import { MailService } from "./services/mail.service";
import { EmailVerification } from "./entities/email-verification.entity";
import { UtilityService } from "./services/utility.service";
import { LoginService } from "./services/login.service";
import { AccountService } from "./services/account.service";
import { AuthGuard } from "./guards/auth.guard";
import { BasketService } from "./services/basket.service";
import { AdminAuthGuard } from "./guards/admin-auth.guard";
import { CategoryService } from "./services/category.service";
import { ItemService } from "./services/item.service";
import { FileService } from "./services/file.service";
import { FileObject } from "./entities/file-object.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Address,
      Category,
      CommercialItem,
      Order,
      User,
      EmailVerification,
      FileObject,
    ]),
  ],
  providers: [
    RegistrationService,
    MailService,
    UtilityService,
    LoginService,
    AccountService,
    AuthGuard,
    BasketService,
    AdminAuthGuard,
    CategoryService,
    ItemService,
    FileService,
  ],
  exports: [
    RegistrationService,
    MailService,
    UtilityService,
    LoginService,
    AccountService,
    AuthGuard,
    BasketService,
    AdminAuthGuard,
    CategoryService,
    ItemService,
    FileService,
  ],
})
export class BusinessModule {}
