import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { Module } from "@nestjs/common";
import { UserModule } from "./UserModule";
import { AuthService } from "../Services/AuthService";
import { APP_GUARD } from "@nestjs/core";
import { AuthGuard } from "../Auth/auth.guard";
import { AuthController } from "../Controllers/AuthController";

@Module({
    imports: [
        ConfigModule.forRoot(),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get("JWT_SECRET_KEY"),
                signOptions: { expiresIn: "1d" },
            }),
            inject: [ConfigService],
        }),
        UserModule,
    ],
    providers: [
        AuthService,
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        },
    ],
    controllers: [AuthController],
    exports: [AuthService],
})
export class AuthModule {
}