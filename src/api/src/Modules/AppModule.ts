import { Module } from "@nestjs/common";
import { AuthModule } from "./AuthModule";
import { UserModule } from "./UserModule";
import { DataSource } from "typeorm";
import { AppController } from "../Controllers/AppController";
import { AppService } from "../Services/AppService";
import { DatabaseModule } from "./DatabaseModule";
import { CartItemModule } from "./CartItemModule";
import { OrderModule } from "./OrderModule";
import { ProductsModule } from "./ProductModule";

@Module({
    imports: [DatabaseModule, AuthModule, UserModule, OrderModule, CartItemModule, ProductsModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
    // @ts-expect-error Unused variables
    public constructor(private _dataSource: DataSource) {
    }
}
