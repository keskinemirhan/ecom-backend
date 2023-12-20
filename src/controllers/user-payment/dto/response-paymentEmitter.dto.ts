import { ApiProperty } from "@nestjs/swagger";

export class ResponsePaymentEmitterDto {
  @ApiProperty({
    description: "Service response result (success / failure)",
  })
  status: string;

  @ApiProperty({
    description: "Error code if service response status is failure",
  })
  errorCode: string;

  @ApiProperty({
    description: "Error message if service response status is failure",
  })
  errorMessage: string;

  @ApiProperty({
    description: "Error group if service response status is failure",
  })
  errorGroup: string;

  @ApiProperty({
    description: "conversation ID to match request and response",
  })
  conversationId: string;
}
