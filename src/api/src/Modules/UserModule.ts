import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../Models/Entities/User";
import { AuthGuard } from "../Auth/auth.guard";
import { APP_GUARD } from "@nestjs/core";
import { UserService } from "../Services/UserService";
import { UserController } from "../Controllers/UserController";

@Module({
    imports: [TypeOrmModule.forFeature([User])],
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
