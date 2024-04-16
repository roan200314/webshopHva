import { Module } from "@nestjs/common";
import { UserService } from "../Services/UserService";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../Models/Entities/User";

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {
}
