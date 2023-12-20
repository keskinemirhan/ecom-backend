import { ApiProperty } from "@nestjs/swagger";

export class RequestPaymentEmitterDto {
  @ApiProperty({
    description: "Service response result (success / failure)",
  })
  status: string;

  @ApiProperty({
    description:
      "If verification is successful, iyzico will return a paymentid. It must be set in Auth request",
  })
  paymentId: string;

  @ApiProperty({
    description:
      "If verification is successful, iyzico might return. If returns, it must be set in Auth request",
  })
  conversationData: string;

  @ApiProperty({
    description: "If set, conversation ID to match request and response",
  })
  conversationId: string;

  @ApiProperty({
    description:
      "1 for successful payment, 0,2,3,4,5,6,7,8 for failure payments",
  })
  mdStatus: string;
}
