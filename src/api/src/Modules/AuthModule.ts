import { JwtModule } from "@nestjs/jwt";
import { Module } from "@nestjs/common";
import { UserModule } from "./UserModule";
import { AuthService } from "../Services/AuthService";
import { APP_GUARD } from "@nestjs/core";
import { AuthGuard } from "../Auth/auth.guard";
import { AuthController } from "../Controllers/AuthController";
import { config } from "dotenv";

config();
config({ path: ".env.production", override: true });
config({ path: ".env.local", override: true });

@Module({
    imports: [
        UserModule,
        JwtModule.register({
            global: true,
            secret: process.env.JWT_SECRET_KEY,
            signOptions: { expiresIn: "7d" },
        }),
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