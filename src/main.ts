import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { MainExceptionFilter } from "./controllers/exception/exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new MainExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle(process.env["APP_NAME"] || "my-application")
    .setDescription(process.env["APP_DESCRIPTION"] || "app-description")
    .setVersion(process.env["APP_VERSION"] || "0.1")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.listen(
    Number(process.env["APP_PORT"]),
    process.env["APP_HOSTNAME"]
  );
}
bootstrap();
