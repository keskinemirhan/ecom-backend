import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BusinessModule } from "./business/business.module";
import { JwtModule } from "@nestjs/jwt";
import { RegisterController } from "./controllers/public/register/register.controller";

@Module({
  imports: [
    BusinessModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      //@ts-ignore
      useFactory: (configService: ConfigService) => ({
        type: configService.get<string>("DB_TYPE", "postgres"),
        host: configService.get<string>("DB_HOST", "localhost"),
        port: parseInt(configService.get<string>("DB_PORT", "5432"), 10),
        username: configService.get<string>("DB_USERNAME", "admin"),
        password: configService.get<string>("DB_PASSWORD", "admin"),
        database: configService.get<string>("DB_NAME", "database"),
        entities: [__dirname + "/**/*.entity{.ts,.js}"],
        synchronize: configService.get<boolean>("DB_SYNCHRONIZE", true),
      }),
      inject: [ConfigService],
    }),
    JwtModule.register({
      global: true,
      secret: process.env["JWT_SECRET"] || "secret",
      signOptions: {
        expiresIn: `${Number(process.env["JWT_EXPIRE_SECONDS"]) || 600}s`,
      },
    }),
  ],
  controllers: [RegisterController],
  providers: [],
})
export class AppModule {}
