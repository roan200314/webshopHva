import { Module } from "@nestjs/common";
import { AuthModule } from "./AuthModule";
import { UserModule } from "./UserModule";
import { DataSource } from "typeorm";
import { AppController } from "../Controllers/AppController";
import { AppService } from "../Services/AppService";
import { DatabaseModule } from "./DatabaseModule";
import { CartItemModule } from "./CartItemModule";
import { OrderModule } from "./OrderModule";
import { AddressModule } from "./AddressModule";
import { MailModule } from "./MailModule";
import { GamesModule } from "./GamesModule";
import { ReviewModule } from "./ReviewModule";
import { ContactModule } from "./ContactModule";

@Module({
    imports: [
        DatabaseModule,
        AuthModule,
        UserModule,
        OrderModule,
        CartItemModule,
        AddressModule,
        MailModule,
        GamesModule,
        ReviewModule,
        ContactModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
    // @ts-expect-error Unused variables
    public constructor(private _dataSource: DataSource) {}
}
