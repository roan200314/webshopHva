import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthGuard } from "../Auth/auth.guard";
import { APP_GUARD } from "@nestjs/core";
import { UserService } from "../Services/UserService";
import { UserController } from "../Controllers/UserController";
import { CartItemModule } from "./CartItemModule";
import { UserData } from "../Models/Entities/UserData";

@Module({
    imports: [TypeOrmModule.forFeature([UserData]), CartItemModule],
    providers: [
        UserService,
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        },
    ],
    controllers: [UserController],
    exports: [UserService],
})
export class UserModule {}
