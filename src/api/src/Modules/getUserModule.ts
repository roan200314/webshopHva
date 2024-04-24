import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../Models/Entities/User";
import { AuthGuard } from "../Auth/auth.guard";
import { APP_GUARD } from "@nestjs/core";
import { AuthService } from "../Services/AuthService";
import { GetUserController } from "../Controllers/GetUserController";

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    providers: [
        AuthService, // Assuming AuthService is needed for user retrieval
        {
            provide: APP_GUARD,
            useClass: AuthGuard, // Assuming authentication guard is needed
        },
    ],
    controllers: [GetUserController],
})
export class GetUserModule {}
