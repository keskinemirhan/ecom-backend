import { ApiProperty } from "@nestjs/swagger";

export class ResponseStarTdsDto {
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
    description: "Language (default: tr)",
  })
  locale: string;

  @ApiProperty({
    description: "Response system timestamp value",
  })
  systemTime: string;

  @ApiProperty({
    description: "3D verification screen in HTML format (Base64 encoded)",
  })
  htmlContent: string;
}
