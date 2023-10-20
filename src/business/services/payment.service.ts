import { Controller } from "@nestjs/common";
import { Address } from "../entities/address.entity";
import { BasketItem } from "../entities/basket-item.entity";
import { User } from "../entities/user.entity";
import { BasketService } from "./basket.service";
const Iyzipay = require("iyzipay");

export interface StartTdsOptions {
  conversationId: string;
  price: string;
  cardNumber: string;
  expireYear: string;
  expireMonth: string;
  cvc: string;
  cardHolderName: string;
  identityNumber: string;
  shippingAddress: Address;
  billingAddress: Address;
  items: BasketItem[];
  user: User;
  ip: string;
}

export interface StartTdsResponse {
  status: string;
  paymentId: string;
  conversationData: string;
  conversationId: string;
  mdStatus: string;
}

@Controller()
export class PaymentService {
  private iyzipay: any;
  private callbackUrl: string;
  constructor(private basketService: BasketService) {
    const apiKey = process.env["IYZICO_API_KEY"];
    const secretKey = process.env["IYZICO_SECRET_KEY"];
    const uri = process.env["IYZICO_URI"];
    this.iyzipay = new Iyzipay({
      apiKey: apiKey,
      secretKey: secretKey,
      uri: uri,
    });
    this.callbackUrl = process.env["IYZICO_CALLBACK_URL"];
  }

  async startTds(options: StartTdsOptions, done: (err, result) => any) {
    const basketItems = options.items.map((item) => {
      return {
        id: item.id,
        name: item.item.name + `${item.count} adet`,
        category1: item.item.category.name,
        price: item.count * item.item.price,
        itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
      };
    });
    const threeDsInitialize = {
      locale: "tr",
      conversationId: options.conversationId,
      price: options.price,
      paidPrice: options.price,
      currency: Iyzipay.CURRENCY.TRY,
      installment: "1",
      callbackUrl: this.callbackUrl,

      paymentCard: {
        cardHolderName: options.cardHolderName,
        cardNumber: options.cardNumber,
        expireMonth: options.expireMonth,
        expireYear: options.expireYear,
        cvc: options.cvc,
      },

      buyer: {
        id: options.user.id,
        name: options.user.name,
        surname: options.user.surname,
        gsmNumber: options.user.phoneNumber,
        email: options.user.email,
        identityNumber: options.identityNumber,
        registrationAddress: options.billingAddress,
        ip: options.ip,
        city: options.billingAddress.city,
        country: options.billingAddress.country,
        zipCode: options.billingAddress.zipCode,
      },

      shippingAddress: {
        contactName:
          options.shippingAddress.contactName +
          " " +
          options.shippingAddress.contactSurname,
        city: options.shippingAddress.city,
        country: options.shippingAddress.country,
        address: options.shippingAddress.address,
        zipCode: options.shippingAddress.zipCode,
      },

      billingAddress: {
        contactName:
          options.billingAddress.contactName +
          " " +
          options.billingAddress.contactSurname,
        city: options.billingAddress.city,
        country: options.billingAddress.country,
        address: options.billingAddress.address,
        zipCode: options.billingAddress.zipCode,
      },
      basketItems,
    };
    this.iyzipay.threedsInitialize.create(
      threeDsInitialize,
      function (err, result) {
        done(err, result);
      }
    );
  }

  async completeThreeDs(
    conversationId: string,
    paymentId: string,
    conversationData: any,
    done: (err: any, result: any) => any
  ) {
    this.iyzipay.threedsPayment.create(
      {
        conversationId,
        paymentId,
        conversationData,
      },
      function (err, result) {
        done(err, result);
      }
    );
  }
}
